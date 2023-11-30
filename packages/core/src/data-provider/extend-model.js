const { promisify } = require('util');
const hasher = require('@sindresorhus/fnv1a');

const beforeNoop = async () => {};
const afterNoop = async (req, data) => { return data; };
const cacheRetrieveNoop = async () => {};
const cacheInsertNoop = async () => {};

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
      this.#before = this.#normalizeAndBindMethod(options.before || beforeNoop, 2);
      this.#after = this.#normalizeAndBindMethod(options.after || afterNoop, 3);
      this.#cacheRetrieve = this.#normalizeAndBindMethod(modelCache?.retrieve || cacheRetrieveNoop, 3, modelCache);
      this.#cacheInsert = this.#normalizeAndBindMethod(modelCache?.insert || cacheInsertNoop, 4, modelCache);
      this.#getProviderData = this.#normalizeAndBindMethod(this.getData, 2);
      this.#getLayer = this.getLayer ? this.#normalizeAndBindMethod(this.getLayer, 2) : undefined;
      this.#getCatalog = this.getCatalog ? this.#normalizeAndBindMethod(this.getCatalog, 2) : undefined;
    }

    #normalizeAndBindMethod (func, callbackArgumentIndex, context = this) {
      return func?.length === callbackArgumentIndex ? promisify(func).bind(context) : func.bind(context);
    }

    async pull (req, callback) {
      const { error } = await this.#authorizeRequest(req);
      if (error) {
        return this.#handleReturn(callback, error);
      }

      const key = this.#createCacheKey(req);

      try {
        const cached = await this.#cacheRetrieve(key, {});
        if (shouldUseCache(cached)) {
          this.logger.debug('fetched data from cache');
          return this.#handleReturn(callback, null, cached);
        }
      } catch (err) {
        this.logger.debug(err);
      }
      
      try {
        await this.#before(req);
        const providerGeojson = await this.#getProviderData(req);
        const modifiedGeojson = await this.#after(req, providerGeojson);
        const { ttl = this.#cacheTtl } = modifiedGeojson;
        if (ttl) {
          this.#cacheInsert(key, modifiedGeojson, { ttl });
        }

        return this.#handleReturn(callback, null, modifiedGeojson);
      } catch (err) {
        return this.#handleReturn(callback, err);
      }
    }

    #handleReturn(callback, error, returnValue) {
      if (callback) {
        return callback(error, returnValue);
      }

      if (error) {
        throw error;
      }

      return returnValue;
    }


    // TODO: the pullLayer() and the pullCatalog() are very similar to the pull()
    // function. We may consider to merging them in the future.
    async pullLayer (req, callback) {
      const { error } = await this.#authorizeRequest(req);
      if (error) {
        return this.#handleReturn(callback, error);
      }

      if (!this.#getLayer) {
        return this.#handleReturn(callback, new Error(`getLayer() method is not implemented in the ${this.namespace} provider.`));
      }

      const key = `${this.#createCacheKey(req)}::layer`;

      try {
        const cached = await this.#cacheRetrieve(key, req.query);
        if (shouldUseCache(cached)) {
          this.logger.debug('fetched data from cache');
          return this.#handleReturn(callback, null, cached);
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
        return this.#handleReturn(callback, null, data);
      } catch (err) {
        return this.#handleReturn(callback, err);
      }
    }

    async pullCatalog (req, callback) {
      const { error } = await this.#authorizeRequest(req);
      if (error) {
        return this.#handleReturn(callback, error);
      }

      if (!this.#getCatalog) {
        return this.#handleReturn(callback, new Error(`getCatalog() method is not implemented in the ${this.namespace} provider.`));
      }

      const key = `${this.#createCacheKey(req)}::catalog`;

      try {
        const cached = await this.#cacheRetrieve(key, req.query);
        if (shouldUseCache(cached)) {
          this.logger.debug('fetched data from cache');
          return this.#handleReturn(callback, null, cached);
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
        return this.#handleReturn(callback, null, data);
      } catch (err) {
        return this.#handleReturn(callback, err);
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

  // If provider has auth methods use them, then use auth-module methods, otherwise dummy methods
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
