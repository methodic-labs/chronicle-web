/*
 * @flow
 */

import _isBoolean from 'lodash/isBoolean';
import isURL from 'validator/lib/isURL';
import { Map, fromJS } from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';

import * as Auth0 from '../auth/Auth0';
import Icon from '../../assets/svg/icons/ol-icon.svg';

const { isNonEmptyObject, isNonEmptyString } = LangUtils;

type Config = {
  auth0ClientId ?:string;
  auth0Domain ?:string;
  auth0Lock ?:{
    allowSignUp ?:boolean;
    logo ?:string;
    primaryColor ?:string;
    redirectUrl ?:string;
    title ?:string;
  };
  authToken ?:?string;
  baseUrl ?:?string;
  csrfToken ?:?string;
};

const LOG = new Logger('Configuration');

const ENV_URLS :Map = fromJS({
  LOCAL: 'http://localhost:8080',
  STAGING: 'https://api.staging.getmethodic.com',
  PRODUCTION: 'https://api.getmethodic.com',
});

function getDefaultBaseUrl() :string {

  let baseUrl :string = '';

  if (window && window.location && window.location.hostname) {
    const hostname :string = window.location.hostname;
    if (hostname === 'localhost') {
      baseUrl = 'localhost';
    }
    else if (hostname.endsWith('getmethodic.com')) {
      baseUrl = hostname.startsWith('staging') ? 'staging' : 'production';
    }
  }

  return baseUrl;
}

let configuration :Map = fromJS({
  auth0ClientId: null,
  auth0Domain: null,
  auth0Lock: {
    allowSignUp: true,
    logo: Icon,
    primaryColor: '#7860ff'
  },
  authToken: null,
  baseUrl: null,
});

function setAuth0ClientId(config :Config) :void {

  if (isNonEmptyString(config.auth0ClientId)) {
    configuration = configuration.set('auth0ClientId', config.auth0ClientId);
  }
  // auth0ClientId is optional, so null and undefined are allowed
  else if (config.auth0ClientId !== null && config.auth0ClientId !== undefined) {
    const errorMsg = 'invalid parameter - "auth0ClientId" must be a non-empty string';
    LOG.error(errorMsg, config.auth0ClientId);
    throw new Error(errorMsg);
  }
}

function setAuth0Domain(config :Config) :void {

  if (isNonEmptyString(config.auth0Domain)) {
    configuration = configuration.set('auth0Domain', config.auth0Domain);
  }
  // auth0Domain is optional, so null and undefined are allowed
  else if (config.auth0Domain !== null && config.auth0Domain !== undefined) {
    const errorMsg = 'invalid parameter - "auth0Domain" must be a non-empty string';
    LOG.error(errorMsg, config.auth0Domain);
    throw new Error(errorMsg);
  }
}

function setAuth0Lock(config :Config) :void {

  // auth0Lock is optional, so null and undefined are allowed
  if (config.auth0Lock === null || config.auth0Lock === undefined) {
    return;
  }

  const { auth0Lock } = config;
  if (!isNonEmptyObject(auth0Lock)) {
    const errorMsg = 'invalid parameter - "auth0Lock" must be a non-empty object';
    LOG.error(errorMsg, auth0Lock);
    throw new Error(errorMsg);
  }

  const { logo } = auth0Lock;
  if (isNonEmptyString(logo)) {
    configuration = configuration.setIn(['auth0Lock', 'logo'], logo);
  }
  // auth0Lock.logo is optional, so null and undefined are allowed
  else if (logo !== null && logo !== undefined) {
    const errorMsg = 'invalid parameter - "auth0Lock.logo" must be a non-empty string';
    LOG.error(errorMsg, logo);
    throw new Error(errorMsg);
  }

  const { title } = auth0Lock;
  if (isNonEmptyString(title)) {
    configuration = configuration.setIn(['auth0Lock', 'title'], title);
  }
  // auth0Lock.title is optional, so null and undefined are allowed
  else if (title !== null && title !== undefined) {
    const errorMsg = 'invalid parameter - "auth0Lock.title" must be a non-empty string';
    LOG.error(errorMsg, title);
    throw new Error(errorMsg);
  }

  const { primaryColor } = auth0Lock;
  if (isNonEmptyString(primaryColor)) {
    configuration = configuration.setIn(['auth0Lock', 'primaryColor'], primaryColor);
  }
  // auth0Lock.primaryÇolor is optional, so null and undefined are allowed
  else if (primaryColor !== null && primaryColor !== undefined) {
    const errorMsg = 'invalid parameter - "auth0Lock.primaryColor" must be a non-empty string';
    LOG.error(errorMsg, primaryColor);
    throw new Error(errorMsg);
  }

  const { allowSignUp } = auth0Lock;
  if (_isBoolean(allowSignUp)) {
    configuration = configuration.setIn(['auth0Lock', 'allowSignUp'], allowSignUp);
  }
  // auth0Lock.allowSignUp is optional, so null and undefined are allowed
  else if (allowSignUp !== null && allowSignUp !== undefined) {
    const errorMsg = 'invalid parameter - "auth0Lock.allowSignUp" must be a boolean';
    LOG.error(errorMsg, allowSignUp);
    throw new Error(errorMsg);
  }
}

function setAuthToken(config :Config) :void {

  const { authToken } = config;

  // authToken is optional, so null and undefined are allowed
  if (authToken === null || authToken === undefined) {
    configuration = configuration.delete('authToken');
  }
  else if (isNonEmptyString(authToken)) {
    configuration = configuration.set('authToken', authToken);
  }
  else {
    const errorMsg = 'invalid parameter - "authToken" must be a non-empty string';
    LOG.error(errorMsg, config.authToken);
    throw new Error(errorMsg);
  }
}

function setBaseUrl(config :Config) :void {

  const { baseUrl = getDefaultBaseUrl() } = config;

  if (isNonEmptyString(baseUrl)) {
    if (baseUrl === 'localhost' || baseUrl === ENV_URLS.get('LOCAL')) {
      configuration = configuration.set('baseUrl', ENV_URLS.get('LOCAL'));
    }
    else if (baseUrl === 'staging' || baseUrl === ENV_URLS.get('STAGING')) {
      configuration = configuration.set('baseUrl', ENV_URLS.get('STAGING'));
    }
    else if (baseUrl === 'production' || baseUrl === ENV_URLS.get('PRODUCTION')) {
      configuration = configuration.set('baseUrl', ENV_URLS.get('PRODUCTION'));
    }
    // mild url validation to at least check the protocol and domain
    else if (baseUrl.startsWith('https://') && isURL(baseUrl)) {
      configuration = configuration.set('baseUrl', baseUrl);
    }
    else {
      const errorMsg = 'invalid parameter - "baseUrl" must be a valid URL';
      LOG.error(errorMsg, baseUrl);
      throw new Error(errorMsg);
    }
  }
  // baseUrl is optional, so null and undefined are allowed
  else if (baseUrl !== null && baseUrl !== undefined) {
    const errorMsg = 'invalid parameter - "baseUrl" must be a non-empty string';
    LOG.error(errorMsg, baseUrl);
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
    const errorMsg = 'invalid parameter - "csrfToken" must be a non-empty string';
    LOG.error(errorMsg, config.csrfToken);
    throw new Error(errorMsg);
  }
}

function configure(config :Config) {

  if (!isNonEmptyObject(config)) {
    const errorMsg = 'invalid parameter - "config" must be a non-empty configuration object';
    LOG.error(errorMsg, config);
    throw new Error(errorMsg);
  }

  setAuth0ClientId(config);
  setAuth0Domain(config);
  setAuth0Lock(config);
  setAuthToken(config);
  setBaseUrl(config);
  setCSRFToken(config);

  Auth0.initialize(configuration);
}

function getConfig() :Map {

  return configuration;
}

export {
  configure,
  getConfig
};

export type {
  Config
};
