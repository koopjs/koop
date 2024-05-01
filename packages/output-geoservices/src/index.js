const FeatureServer = require('@koopjs/featureserver');
const {
  restInfo,
  serverInfo,
  layerInfo,
  layersInfo,
  query,
  generateRenderer,
  queryRelatedRecords,
} = require('@koopjs/featureserver');
const Logger = require('@koopjs/logger');
let logger = new Logger();
const ARCGIS_UNAUTHORIZED_MESSAGE = 'Item does not exist or is inaccessible.';
const ARCGIS_UNABLE_TO_GENERATE_TOKEN_MESSAGE = 'Unable to generate token.';

const tokenGenerationError = {
  error: {
    code: 400,
    message: ARCGIS_UNABLE_TO_GENERATE_TOKEN_MESSAGE,
    details: ['Invalid username or password.'],
  },
};

const tokenRequiredError = {
  error: {
    code: 499,
    message: 'Token Required',
    messageCode: 'GWM_0003',
    details: ['Token Required'],
  },
};

const invalidTokenError = {
  error: {
    code: 498,
    message: 'Invalid token.',
    details: [],
  },
};

const authorizationError = {
  error: {
    code: 400,
    messageCode: 'CONT_0001',
    message: ARCGIS_UNAUTHORIZED_MESSAGE,
    details: [],
  },
};

class GeoServices {
  #useHttpForTokenUrl = false;
  #authInfo;
  #logger;
  #includeOwningSystemUrl;
  #restInfoProtocol;

  static type = 'output';
  static version = require('../package.json').version;
  static routes = [
    {
      path: '$namespace/rest/info',
      methods: ['get', 'post'],
      handler: 'restInfoHandler',
    },
    {
      path: '$namespace/rest/generateToken',
      methods: ['get', 'post'],
      handler: 'generateToken',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer',
      methods: ['get', 'post'],
      handler: 'serverInfoHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
      methods: ['get', 'post'],
      handler: 'layersInfoHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
      methods: ['get', 'post'],
      handler: 'layerInfoHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/info',
      methods: ['get', 'post'],
      handler: 'layerInfoHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/query',
      methods: ['get', 'post'],
      handler: 'queryHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/generateRenderer',
      methods: ['get', 'post'],
      handler: 'generateRendererHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/queryRelatedRecords',
      methods: ['get', 'post'],
      handler: 'queryRelatedRecordsHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/MapServer*',
      methods: ['get', 'post'],
      handler: 'invalidUrlHandler',
    },
  ];

  constructor(model, options = {}) {
    this.model = model;
    this.#logger = options.logger || logger;
    this.#authInfo = options.authInfo || {
      isTokenBasedSecurity: true,
    };

    this.#includeOwningSystemUrl = options.includeOwningSystemUrl || false;
    this.#restInfoProtocol = this.#getHttpSetting(options, model) ? 'http' : 'https';

    FeatureServer.setLogger({ logger: this.#logger });

    // Set overrides
    FeatureServer.setDefaults(options.defaults);
  }

  #getHttpSetting(options, model) {
    if (options.useHttpForTokenUrl || process.env.GEOSERVICES_HTTP === 'true') {
      return options.useHttpForTokenUrl || process.env.GEOSERVICES_HTTP === 'true';
    }

    if (typeof model.authenticationSpecification === 'function') {
      return model.authenticationSpecification()?.useHttp === true;
    }

    if (typeof process.env.KOOP_AUTH_HTTP !== 'undefined') {
      this.#logger.warn(
        'Use of "KOOP_AUTH_HTTP" environment variable is deprecated.  It will be removed in a future release. Use the "useHttpForTokenUrl" option or "GEOSERVICES_HTTP" environment variable.', // eslint-disable-line
      );
      return process.env.KOOP_AUTH_HTTP === 'true';
    }

    return false;
  }

  async invalidUrlHandler(req, res) {
    const error = new Error('Invalid URL');
    error.code = 400;
    error.details = ['Invalid URL'];
    this.#errorHandler(error, req, res);
  }

  #errorHandler(error, req, res) {
    this.#logger.error(error);

    const token = this.#extractTokenFromRequest(req);
    const { code, message, details = [] } = normalizeError(error);

    res.status(200); // ArcGIS standard is to wrap errors in 200 success

    if (isMissingTokenError(code, token)) {
      return res.json(tokenRequiredError);
    }

    if (isInvalidTokenError(code, token)) {
      return res.json(invalidTokenError);
    }

    if (isUnauthorizedError(code, message)) {
      return res.json(authorizationError);
    }

    return res.json({
      error: {
        code: code || 500,
        message,
        details,
      },
    });
  }

  #extractTokenFromRequest(req) {
    const {
      headers: { authorization },
      query,
      body,
    } = req;

    if (authorization) {
      return authorization.replace(/^Bearer /, '');
    }

    return query.token || body.token;
  }

  restInfoHandler(req, res) {
    const authInfo = { ...this.#authInfo };
    const {
      headers: { host },
      baseUrl,
    } = req;

    if (this.#authInfo.isTokenBasedSecurity) {
      req.headers.host, req.baseUrl;
      authInfo.tokenServicesUrl = `${this.#restInfoProtocol}://${host}${baseUrl}/${this.model.namespace}/rest/generateToken`; // eslint-disable-line
    }

    const data = { authInfo };
    if (this.#includeOwningSystemUrl) {
      data.owningSystemUrl = `${this.#restInfoProtocol}://${host}${baseUrl}/${this.model.namespace}`; // eslint-disable-line
    }

    try {
      restInfo(req, res, data);
    } catch (error) {
      this.#errorHandler(error, req, res);
    }
  }

  async #pullDataHandler(req, res, handler) {
    try {
      const data = await this.model.pull(req);
      return handler(req, res, data);
    } catch (error) {
      this.#errorHandler(error, req, res);
    }
  }

  async serverInfoHandler(req, res) {
    this.#pullDataHandler(req, res, serverInfo);
  }

  async layersInfoHandler(req, res) {
    this.#pullDataHandler(req, res, layersInfo);
  }

  async layerInfoHandler(req, res) {
    this.#pullDataHandler(req, res, layerInfo);
  }

  async queryHandler(req, res) {
    this.#pullDataHandler(req, res, query);
  }

  async generateRendererHandler(req, res) {
    this.#pullDataHandler(req, res, generateRenderer);
  }

  async queryRelatedRecordsHandler(req, res) {
    this.#pullDataHandler(req, res, queryRelatedRecords);
  }

  async generateToken(req, res) {
    try {
      const tokenResponse = await this.model.authenticate(req);
      res.status(200).json(tokenResponse);
    } catch (error) {
      const { code, message, details = [] } = normalizeError(error);

      res.status(200);

      if (isGenerateTokenError(code, message)) {
        return res.json(tokenGenerationError);
      }

      return res.json({
        error: {
          code: code || 500,
          message,
          details,
        },
      });
    }
  }
}

function isMissingTokenError(code, token) {
  return code === 'COM_0019' || code === 499 || (code === 401 && !token);
}

function isInvalidTokenError(code, token) {
  return code === 498 || (code === 401 && token);
}

function isUnauthorizedError(code, message) {
  return code === 403 || message === ARCGIS_UNAUTHORIZED_MESSAGE;
}

function isGenerateTokenError(code, message) {
  return code === 401 || message === ARCGIS_UNABLE_TO_GENERATE_TOKEN_MESSAGE;
}

function normalizeError(error) {
  if (error.error) {
    return error.error;
  }

  return error;
}

module.exports = GeoServices;
