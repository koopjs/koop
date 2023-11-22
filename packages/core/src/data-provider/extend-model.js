const { promisify } = require('util');
const hasher = require('@sindresorhus/fnv1a');

const before = (req, callback) => { callback(); };
const after = (req, data, callback) => { callback(null, data); };
const cacheRetrieveNoop = (key, options, callback) => { callback(); };
const cacheInsertNoop = (key, options, data, callback) => { callback(); };

module.exports = function extendModel ({ ProviderModel, namespace, logger, cache, authModule }, options = {}) {
  class Model extends ProviderModel {
    #cacheTtl;
    #before;
    #after;
    #cacheRetrieve;
    #cacheInsert;
    #getProviderData;
    #getLayer;
    #getCatalog;

    constructor ({ logger, cache }, options) {

      super({ logger, log: logger }, options);
      // Provider constructor's may assign values to this.cache
      const modelCache = this.cache || options.cache || cache;
      this.#cacheTtl = options.cacheTtl;
      this.namespace = namespace;
      this.logger = logger;
      this.#before = promisify(options.before || before);
      this.#after = promisify(options.after || after);
      this.#cacheRetrieve = promisify(modelCache?.retrieve || cacheRetrieveNoop).bind(modelCache);
      this.#cacheInsert = promisify(modelCache?.insert || cacheInsertNoop).bind(modelCache);
      this.#getProviderData = promisify(this.getData).bind(this);
      this.#getLayer = this.getLayer ? promisify(this.getLayer).bind(this) : undefined;
      this.#getCatalog = this.getCatalog ? promisify(this.getCatalog).bind(this) : undefined;
    }

    async pull (req, callback) {
      const { error } = await this.#authorizeRequest(req);
      if (error) {
        return callback(error);
      }

      const key = this.#createCacheKey(req);

      try {
        const cached = await this.#cacheRetrieve(key, {});
        if (shouldUseCache(cached)) {
          return callback(null, cached);
        }
      } catch (err) {
        this.logger.debug(err);
      }
      
      try {
        await this.#before(req);
        const providerGeojson = await this.#getProviderData(req);
        const afterFuncGeojson = await this.#after(req, providerGeojson);
        const { ttl = this.#cacheTtl } = afterFuncGeojson;
        if (ttl) {
          this.#cacheInsert(key, afterFuncGeojson, { ttl });
        }
        callback(null, afterFuncGeojson);
      } catch (err) {
        callback(err);
      }
    }

    // TODO: the pullLayer() and the pullCatalog() are very similar to the pull()
    // function. We may consider to merging them in the future.
    async pullLayer (req, callback) {
      const { error } = await this.#authorizeRequest(req);
      if (error) {
        return callback(error);
      }

      if (!this.#getLayer) {
        callback(new Error(`getLayer() method is not implemented in the ${this.namespace} provider.`));
      }

      const key = `${this.#createCacheKey(req)}::layer`;

      try {
        const cached = await this.#cacheRetrieve(key, req.query);
        if (shouldUseCache(cached)) {
          return callback(null, cached);
        }
      } catch (err) {
        this.logger.debug(err);
      }

      try {
        const data = await this.#getLayer(req);
        const ttl = data.ttl || this.#cacheTtl;
        if (ttl) {
          await this.#cacheInsert(key, data, { ttl });
        }
        callback(null, data);
      } catch (err) {
        callback(err);
      }
    }

    async pullCatalog (req, callback) {
      const { error } = await this.#authorizeRequest(req);
      if (error) {
        return callback(error);
      }

      if (!this.#getCatalog) {
        callback(new Error(`getCatalog() method is not implemented in the ${this.namespace} provider.`));
      }

      const key = `${this.#createCacheKey(req)}::catalog`;

      try {
        const cached = await this.#cacheRetrieve(key, req.query);
        if (shouldUseCache(cached)) {
          return callback(null, cached);
        }
      } catch (err) {
        this.logger.debug(err);
      }

      try {
        const data = await this.#getCatalog(req);
        const ttl = data.ttl || this.#cacheTtl;
        if (ttl) {
          this.#cacheInsert(key, data, { ttl });
        }
        callback(null, data);
      } catch (err) {
        callback(err);
      }
    }

    async pullStream (req) {
      const { error } = await this.#authorizeRequest(req);
      
      if (error) {
        throw error;
      }
  
      if (this.getStream) {
        await this.#before(req);
        const providerStream = await this.getStream(req);
        return providerStream;
      } else {
        throw new Error('getStream() function is not implemented in the provider.');
      }
    }

    #createCacheKey (req) {
      const providerKeyGenerator = this.createCacheKey || this.createKey;
      if (providerKeyGenerator) {
        return providerKeyGenerator(req);
      }
      return hasher(req.url).toString();
    }

    async #authorizeRequest (req) {
      try {
        await this.authorize(req);
      } catch (error) {
        error.code = 401;
        return { error };
      }

      return { error: null };
    }
  }

  // If provider does not have auth-methods, 
  // check for global auth-module. if exists, use it, 
  // otherwise use dummy methods

  if (typeof ProviderModel.prototype.authorize !== 'function') {
    Model.prototype.authorize = typeof authModule?.authorize  === 'function' ? authModule.authorize : async () => {};
  }

  if (typeof ProviderModel.prototype.authenticate !== 'function') {
    Model.prototype.authenticate =  typeof authModule?.authenticate === 'function' ? authModule?.authenticate : async () => { return {}; };
  }

  if(typeof authModule?.authenticationSpecification === 'function') {
    logger.warn('Use of "authenticationSpecification" is deprecated. It will be removed in a future release.');
    Model.prototype.authenticationSpecification =  authModule?.authenticationSpecification;
  }
  // Add auth methods if auth plugin registered with Koop
  // if (authModule) {
  //   const {
  //     authenticationSpecification,
  //     authenticate,
  //     authorize
  //   } = authModule;

  //   Model.prototype.authenticationSpecification = Object.assign({}, authenticationSpecification(namespace), { provider: namespace });
  //   Model.prototype.authenticate = authenticate;
  //   Model.prototype.authorize = authorize;
  // }

  return new Model({ logger, cache }, options);
};



function shouldUseCache (cacheEntry) {
  // older cache plugins stored expiry time explicitly; all caches should move to returning empty if expired
  if (!cacheEntry) {
    return false;
  }

  const { expires } = cacheEntry?._cache || cacheEntry?.metadata || {};
  if (!expires) {
    return true;
  }
  
  return Date.now() < expires;
}
