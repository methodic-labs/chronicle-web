/*
 * @flow
 */

import decode from 'jwt-decode';

import { AUTH0_ID_TOKEN } from '../../../common/constants';

export default function getAuthToken() :?string {

  const authToken :?string = localStorage.getItem(AUTH0_ID_TOKEN);

  if (typeof authToken === 'string' && authToken.trim().length) {
    try {
      // this is not sufficient validation, only confirms the token is well formed
      // TODO:
      //   validate token, verify its signature
      //   https://auth0.com/docs/tokens/id-token#verify-the-signature
      //   https://auth0.com/docs/api-auth/tutorials/verify-access-token
      decode(authToken);
      return authToken;
    }
    catch (e) {
      return null;
    }
  }

  return null;
}
