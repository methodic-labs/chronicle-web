/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';

const { isNonEmptyObject, isNonEmptyString } = LangUtils;

// injected by Webpack.DefinePlugin
declare var __ENV_PROD__ :boolean;

type Config = {
  authToken ?:?string;
  baseUrl :string;
  csrfToken ?:?string;
};

const LOG = new Logger('Configuration');

const ENV_URLS :Map<string, string> = fromJS({
  LOCAL: 'http://localhost:8080',
  STAGING: 'https://api.staging.getmethodic.com',
  PRODUCTION: 'https://api.getmethodic.com',
});

let configuration :Map<string, string> = fromJS({
  authToken: '',
  baseUrl: ENV_URLS.get('LOCAL')
});

function setAuthToken(config :Config) :void {

  // authToken is optional, so null and undefined are allowed
  if (config.authToken === null || config.authToken === undefined) {
    LOG.warn('authToken has not been configured, expect errors');
    configuration = configuration.delete('authToken');
  }
  else if (isNonEmptyString(config.authToken)) {
    configuration = configuration.set('authToken', config.authToken);
  }
  else {
    const errorMsg = 'invalid parameter - authToken must be a non-empty string';
    LOG.error(errorMsg, config.authToken);
    throw new Error(errorMsg);
  }
}

function setBaseUrl(config :Config) :void {

  if (isNonEmptyString(config.baseUrl)) {
    if (config.baseUrl === 'localhost' || config.baseUrl === ENV_URLS.get('LOCAL')) {
      configuration = configuration.set('baseUrl', ENV_URLS.get('LOCAL'));
    }
    else if (config.baseUrl === 'staging' || config.baseUrl === ENV_URLS.get('STAGING')) {
      configuration = configuration.set('baseUrl', ENV_URLS.get('STAGING'));
    }
    else if (config.baseUrl === 'production' || config.baseUrl === ENV_URLS.get('PRODUCTION')) {
      configuration = configuration.set('baseUrl', ENV_URLS.get('PRODUCTION'));
    }
    // mild url validation to at least check the protocol and domain
    else if (config.baseUrl.startsWith('https://') && config.baseUrl.endsWith('getmethodic.com')) {
      configuration = configuration.set('baseUrl', config.baseUrl);
    }
    else {
      const errorMsg = 'invalid parameter - baseUrl must be a valid URL';
      LOG.error(errorMsg, config.baseUrl);
      throw new Error(errorMsg);
    }
  }
  else {
    const errorMsg = 'invalid parameter - baseUrl must be a non-empty string';
    LOG.error(errorMsg, config.baseUrl);
    throw new Error(errorMsg);
  }
}

function setCSRFToken(config :Config) {

  // csrfToken is optional, so null and undefined are allowed
  if (config.csrfToken === null || config.csrfToken === undefined) {
    LOG.warn('csrfToken has not been configured, expect errors');
    configuration = configuration.delete('csrfToken');
  }
  else if (isNonEmptyString(config.csrfToken)) {
    configuration = configuration.set('csrfToken', config.csrfToken);
  }
  else {
    const errorMsg = 'invalid parameter - csrfToken must be a non-empty string';
    LOG.error(errorMsg, config.csrfToken);
    throw new Error(errorMsg);
  }
}

function configure(config :Config) {

  if (!isNonEmptyObject(config)) {
    const errorMsg = 'invalid parameter - config must be a non-empty configuration object';
    LOG.error(errorMsg, config);
    throw new Error(errorMsg);
  }

  setAuthToken(config);
  setBaseUrl(config);
  setCSRFToken(config);
}

function getConfig() :Map<*, *> {

  return configuration;
}

export {
  configure,
  getConfig
};

export type {
  Config
};
