/*
 * @flow
 */

import decode from 'jwt-decode';

import getAuthToken from './getAuthToken';

import { AUTH_TOKEN_EXPIRED } from '../../../common/constants';

export default function getAuthTokenExpiration(maybeAuthToken :?string) :number {

  let authToken :?string = maybeAuthToken;

  if (authToken === null || authToken === undefined) {
    authToken = getAuthToken();
  }

  if (!authToken) {
    return AUTH_TOKEN_EXPIRED;
  }

  try {
    // Auth0 JWT tokens set the expiration date as seconds since the Unix Epoch, not milliseconds
    // https://auth0.com/docs/tokens/id-token#id-token-payload
    const authTokenDecoded :Object = decode(authToken);
    const expirationInMillis :number = authTokenDecoded.exp * 1000;
    return expirationInMillis;
  }
  catch (e) {
    return AUTH_TOKEN_EXPIRED;
  }
}
