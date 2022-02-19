/*
 * @flow
 */

import Auth0Lock from 'auth0-lock';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';
import { Map } from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';

import { clearAuthInfo, getAuthToken, hasAuthTokenExpired } from './utils';

const { isNonEmptyString } = LangUtils;

const LOG = new Logger('Auth0');

let parsedUrl :Object = {
  fragment: '',
  redirectUrl: '',
  state: '',
};

/*
 * https://auth0.com/docs/libraries/lock/v10
 * https://auth0.com/docs/libraries/lock/v10/api
 * https://auth0.com/docs/libraries/lock/v10/customization
 */
let auth0Lock :?Auth0Lock;

function getAuth0LockInstance() :Auth0Lock {

  if (auth0Lock === null || auth0Lock === undefined) {
    throw new Error('Auth0Lock is not initialized');
  }

  return auth0Lock;
}

function urlAuthInfoAvailable() :boolean {

  // TODO: just checking for the existence of "access_token" and "id_token" isn't strong enough validation
  return parsedUrl.fragment.indexOf('access_token') !== -1 && parsedUrl.fragment.indexOf('id_token') !== -1;
}

/*
 * ideally, we should be using browser history and OIDC conformant authentication. until then, we have to take extra
 * steps in the auth flow to handle the Auth0 redirect. Auth0 redirects back to "#access_token...", which will be
 * immediately replaced with "#/access_token..." when hash history is initializing:
 *
 * https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L38
 * https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L49
 *
 * Here, we grab the Auth0 response from the URL and redirect to "#/login", which avoids the need for hash history
 * to invoke window.location.replace().
 */
function parseUrl(location :Object) :Object {

  if (isEmpty(location)) {
    return {
      fragment: '',
      redirectUrl: '',
      state: '',
    };
  }

  const { href, search } = location;

  const { redirectUrl } = qs.parse(search, { ignoreQueryPrefix: true });
  if (isNonEmptyString(redirectUrl)) {
    parsedUrl.redirectUrl = redirectUrl;
  }

  const { state } = qs.parse(href);
  if (isNonEmptyString(state)) {
    parsedUrl.state = state;
  }

  const hashIndex :number = href.lastIndexOf('#');
  const fragment :string = hashIndex === -1 ? '' : href.substring(hashIndex + 1);
  parsedUrl.fragment = fragment;

  if (urlAuthInfoAvailable()) {
    const urlBeforeHash :string = href.slice(0, hashIndex >= 0 ? hashIndex : 0);
    if (urlBeforeHash.endsWith('/')) {
      window.location.replace(`${urlBeforeHash}#/login`);
    }
    else {
      window.location.replace(`${urlBeforeHash}/#/login`);
    }
  }

  return parsedUrl;
}

function initialize(config :Map<string, *>) :void {

  // TODO: need better validation on the configuration object
  if (!config || config.isEmpty()) {
    LOG.error('Auth0 : initialize() - invalid configuration object', config);
    throw new Error('Auth0 : initialize() - invalid configuration object');
  }

  parsedUrl = parseUrl(window.location);

  auth0Lock = new Auth0Lock(
    config.get('auth0ClientId'),
    config.get('auth0Domain'),
    {
      _enableIdPInitiatedLogin: true,
      allowSignUp: config.getIn(['auth0Lock', 'allowSignUp'], true),
      auth: {
        autoParseHash: false,
        params: {
          scope: 'openid email user_id user_metadata app_metadata nickname roles'
        },
        redirectUrl: parsedUrl.redirectUrl,
        responseType: 'token',
        sso: false,
        state: parsedUrl.state,
      },
      clientBaseUrl: 'https://cdn.auth0.com',
      configurationBaseUrl: 'https://cdn.auth0.com',
      closable: false,
      hashCleanup: false,
      languageDictionary: {
        title: config.getIn(['auth0Lock', 'title'], '')
      },
      rememberLastLogin: false,
      theme: {
        logo: config.getIn(['auth0Lock', 'logo'], ''),
        primaryColor: config.getIn(['auth0Lock', 'primaryColor'], '')
      }
    }
  );

  if (hasAuthTokenExpired(getAuthToken())) {
    clearAuthInfo();
  }
}

function authenticate() :Promise<*> {

  // TODO: just checking for the existence of "access_token" and "id_token" isn't strong enough validation
  if (!urlAuthInfoAvailable()) {
    return Promise.reject(new Error('Auth0 fragment identifier has not been parsed'));
  }

  return new Promise((resolve :Function, reject :Function) => {

    if (auth0Lock === null || auth0Lock === undefined) {
      LOG.error('Auth0Lock is not initialized');
      reject(new Error('Auth0Lock is not initialized'));
      return;
    }

    auth0Lock.on('authorization_error', (error) => {
      LOG.error('Auth0Lock : on("authorization_error")', error);
      reject(new Error('Auth0Lock : on("authorization_error")'));
    });

    auth0Lock.on('unrecoverable_error', (error) => {
      LOG.error('Auth0Lock : on("unrecoverable_error")', error);
      reject(new Error('Auth0Lock : on("unrecoverable_error")'));
    });

    auth0Lock.on('authenticated', (authInfo :Object) => {
      if (!authInfo || !authInfo.accessToken || !authInfo.idToken) {
        LOG.error('Auth0Lock : on("authenticated") - auth info missing');
        reject(new Error('Auth0Lock : on("authenticated") - auth info missing'));
      }
      else if (hasAuthTokenExpired(authInfo.idToken)) {
        LOG.error('Auth0Lock : on("authenticated") - auth token expired');
        reject(new Error('Auth0Lock : on("authenticated") - auth token expired'));
      }
      else {
        parsedUrl.fragment = '';
        parsedUrl.redirectUrl = '';
        resolve({ authInfo, state: parsedUrl.state });
      }
    });

    auth0Lock.on('hash_parsed', (authInfo :Object) => {
      if (!authInfo || !authInfo.accessToken || !authInfo.idToken) {
        LOG.error('Auth0Lock : on("hash_parsed") - auth info missing');
        reject(new Error('Auth0Lock : on("hash_parsed") - auth info missing'));
      }
      else if (hasAuthTokenExpired(authInfo.idToken)) {
        LOG.error('Auth0Lock : on("hash_parsed") - auth token expired');
        reject(new Error('Auth0Lock : on("hash_parsed") - auth token expired'));
      }
    });

    // TODO: consider implementing the callback function any special error handling
    auth0Lock.resumeAuth(parsedUrl.fragment, () => {});
  });
}

export {
  authenticate,
  getAuth0LockInstance,
  initialize,
  parseUrl,
  urlAuthInfoAvailable,
};
