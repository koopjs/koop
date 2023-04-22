const { promisify } = require('util');
const _ = require('lodash');
const before = (req, callback) => { callback(); };
const after = (req, data, callback) => { callback(null, data); };

module.exports = function createModel ({ ProviderModel, koop, namespace }, options = {}) {
  class Model extends ProviderModel {
    constructor (koop, options) {
      // Merging the koop object into options to preserve backward compatibility
      // This should be removed in future major release now that registration 
      // options are passed as separate arg
      const koopAndOptions = _.chain(options).omit(options, 'cache', 'before', 'after').assign(koop).value();
      super(koopAndOptions, options);
      // Provider constructor's may assign values to this.cache and this.options; so check before assigning defaults
      if (!this.cache) this.cache = options.cache || koop.cache;
      if (!this.options) this.options = koopAndOptions;
      this.before = promisify(options.before || before);
      this.after = promisify(options.after || after);
      this.cacheRetrieve = promisify(this.cache.retrieve).bind(this.cache);
      this.cacheUpsert = promisify(this.cache.upsert).bind(this.cache);
      this.getData = promisify(this.getData).bind(this);
      this.logger = koop.log;
    }

    async pull (req, callback) {
      const key = (this.createKey) ? this.createKey(req) : createKey(req);

      try {
        const cached = await this.cacheRetrieve(key, req.query);
        if (shouldUseCache(cached)) {
          return callback(null, cached);
        }
      } catch (err) {
        this.logger.debug(err);
      }
      
      try {
        await this.before(req);
        const providerGeojson = await this.getData(req);
        const afterFuncGeojson = await this.after(req, providerGeojson);
        const { ttl } = afterFuncGeojson;
        if (ttl) {
          this.cacheUpsert(key, afterFuncGeojson, { ttl });
        }
        callback(null, afterFuncGeojson);
      } catch (err) {
        callback(err);
      }
    }

    // TODO: the pullLayer() and the pullCatalog() are very similar to the pull()
    // function. We may consider to merging them in the future.
    pullLayer (req, callback) {
      const key = (this.createKey) ? this.createKey(req) : `${createKey(req)}::layer`;
      this.cache.retrieve(key, req.query, (err, cached) => {
        if (!err && shouldUseCache(cached)) {
          callback(null, cached);
        } else if (this.getLayer) {
          this.getLayer(req, (err, data) => {
            if (err) return callback(err);
            callback(null, data);
            if (data.ttl) this.cache.upsert(key, data, { ttl: data.ttl });
          });
        } else {
          callback(new Error('getLayer() function is not implemented in the provider.'));
        }
      });
    }

    pullCatalog (req, callback) {
      const key = (this.createKey) ? this.createKey(req) : `${createKey(req)}::catalog`;
      this.cache.retrieve(key, req.query, (err, cached) => {
        if (!err && shouldUseCache(cached)) {
          callback(null, cached);
        } else if (this.getCatalog) {
          this.getCatalog(req, (err, data) => {
            if (err) return callback(err);
            callback(null, data);
            if (data.ttl) this.cache.upsert(key, data, { ttl: data.ttl });
          });
        } else {
          callback(new Error('getCatalog() function is not implemented in the provider.'));
        }
      });
    }

    async pullStream (req) {
      if (this.getStream) {
        await this.before(req);
        const providerStream = await this.getStream(req);
        return providerStream;
      } else {
        throw new Error('getStream() function is not implemented in the provider.');
      }
    }
  }

  // Add auth methods if auth plugin registered with Koop
  if (koop._authModule) {
    const {
      authenticationSpecification,
      authenticate,
      authorize
    } = koop._authModule;

    Model.prototype.authenticationSpecification = Object.assign({}, authenticationSpecification(namespace), { provider: namespace });
    Model.prototype.authenticate = authenticate;
    Model.prototype.authorize = authorize;
  }
  return new Model(koop, options);
};

function createKey (req) {
  let key = req.url.split('/')[1];
  if (req.params.host) key = [key, req.params.host].join('::');
  if (req.params.id) key = [key, req.params.id].join('::');
  if (req.params.layer) key = [key, req.params.layer].join('::');
  return key;
}

function shouldUseCache ({_cache, metadata}) {
  // older cache plugins stored cache timing in "metadata"
  const cacheMetadata = _cache || metadata || {};
  if (!cacheMetadata?.expires) {
    return true;
  }
  
  return Date.now() < cacheMetadata.expires;
}
