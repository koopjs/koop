const { promisify } = require('util');
const FeatureServer = require('../../featureserver');
const Logger = require('../../logger');
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
    details: [],
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
  #useHttp = false;
  #pullData;

  static type = 'output';
  static version = require('../package.json').version;
  static routes = [
    {
      path: '$namespace/rest/info',
      methods: ['get', 'post'],
      handler: 'restInfoHandler',
    },
    {
      path: '$namespace/tokens/:method',
      methods: ['get', 'post'],
      handler: 'generateToken',
    },
    {
      path: '$namespace/tokens/',
      methods: ['get', 'post'],
      handler: 'generateToken',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method',
      methods: ['get', 'post'],
      handler: 'generalHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
      methods: ['get', 'post'],
      handler: 'generalHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
      methods: ['get', 'post'],
      handler: 'generalHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer',
      methods: ['get', 'post'],
      handler: 'generalHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/FeatureServer*',
      methods: ['get', 'post'],
      handler: 'generalHandler',
    },
    {
      path: '$namespace/rest/services/$providerParams/MapServer*',
      methods: ['get', 'post'],
      handler: 'generalHandler',
    },
  ];

  constructor(model, options = {}) {
    this.model = model;
    this.#pullData = promisify(this.model.pull).bind(this.model);
    this.options = options;
    this.logger = options.logger || logger;
    this.authInfo = options.authInfo || {};
    this.#useHttp =
      this.model.authenticationSpecification?.useHttp === true ||
      process.env.KOOP_AUTH_HTTP === 'true';
    FeatureServer.setLogger({ logger: this.logger });

    // Set overrides
    FeatureServer.setDefaults(options.defaults);
  }

  async generalHandler(req, res) {
    try {
      if (this.#shouldAuthorize()) {
        await this.model.authorize(req);
      }

      const data = await this.#pullData(req);
      return FeatureServer.route(req, res, data);
    } catch (error) {
      this.logger.error(error);

      const token = this.#getToken(req);
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
  }

  #shouldAuthorize() {
    return typeof this.model.authorize === 'function';
  }

  #getToken(req) {
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
    const authInfo = { ...this.authInfo };

    if (this.model.authenticationSpecification) {
      authInfo.isTokenBasedSecurity = true;

      authInfo.tokenServicesUrl = this.#buildTokensUrl(
        req.headers.host,
        req.baseUrl,
      );
    }

    FeatureServer.route(req, res, { authInfo });
  }

  #buildTokensUrl(host, baseUrl) {
    const protocol = this.#useHttp ? 'http' : 'https';
    return `${protocol}://${host}${baseUrl}/${this.model.namespace}/tokens/`;
  }

  async generateToken(req, res) {
    if (typeof this.model.authenticate !== 'function') {
      return res
        .status(500)
        .json({ error: '"authenticate" not implemented for this provider' });
    }

    try {
      const tokenResponse = await this.model.authenticate(req);
      res
        .status(200)
        .json({ ...tokenResponse, ssl: tokenResponse.ssl || false });
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
