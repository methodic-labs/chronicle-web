/*
 * @flow
 */

import cookies from 'js-cookie';
import decode from 'jwt-decode';
import { LangUtils, Logger } from 'lattice-utils';
import { v4 as uuid } from 'uuid';

import getAuthTokenExpiration from './getAuthTokenExpiration';
import getDomainForCookie from './getDomainForCookie';

import {
  AUTH0_ID_TOKEN,
  AUTH0_USER_INFO,
  AUTH_COOKIE,
  AUTH_TOKEN_EXPIRED,
  CSRF_COOKIE,
} from '../../../common/constants';
import type { UserInfo } from '../../../common/types';

const LOG = new Logger('storeAuthInfo');

const { isNonEmptyObject } = LangUtils;

export default function storeAuthInfo(authInfo :?Object) {

  if (!authInfo || !authInfo.idToken) {
    return;
  }

  try {
    // this is not sufficient validation, only confirms the token is well formed
    // TODO:
    //   validate token, verify its signature
    //   https://auth0.com/docs/tokens/id-token#verify-the-signature
    //   https://auth0.com/docs/api-auth/tutorials/verify-access-token
    decode(authInfo.idToken);

    const { hostname } = window.location;
    const authCookie :string = `Bearer ${authInfo.idToken}`;
    const authTokenExpiration :number = getAuthTokenExpiration(authInfo.idToken);
    if (authTokenExpiration !== AUTH_TOKEN_EXPIRED) {
      localStorage.setItem(AUTH0_ID_TOKEN, authInfo.idToken);
      cookies.set(AUTH_COOKIE, authCookie, {
        SameSite: 'strict',
        domain: getDomainForCookie(),
        expires: new Date(authTokenExpiration),
        path: '/',
        secure: (hostname !== 'localhost'),
      });
      cookies.set(CSRF_COOKIE, uuid(), {
        SameSite: 'strict',
        domain: getDomainForCookie(),
        expires: new Date(authTokenExpiration),
        path: '/',
        secure: (hostname !== 'localhost'),
      });
    }
    else {
      LOG.warn(`not setting "${AUTH_COOKIE}" cookie because auth token is expired`);
    }
  }
  catch (e) {
    LOG.error(`caught exception while setting "${AUTH_COOKIE}" cookie`, e);
    return;
  }

  if (!isNonEmptyObject(authInfo.idTokenPayload)) {
    return;
  }

  const userInfo :UserInfo = {
    email: authInfo.idTokenPayload.email,
    familyName: authInfo.idTokenPayload.family_name,
    givenName: authInfo.idTokenPayload.given_name,
    id: authInfo.idTokenPayload.sub,
    name: authInfo.idTokenPayload.name,
    picture: authInfo.idTokenPayload.picture,
    // NOTE - 2022-02-21 - "getmethodic.com/metadata" is a custom claim which is added to the token during login and
    // is defined in an auth0 action that runs during the login flow
    // https://auth0.com/docs/get-started/apis/scopes/sample-use-cases-scopes-and-claims#add-custom-claims-to-a-token
    roles: authInfo.idTokenPayload['getmethodic.com/metadata']?.roles || [],
  };

  localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(userInfo));
}
