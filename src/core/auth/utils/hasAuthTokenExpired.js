/*
 * @flow
 */

import decode from 'jwt-decode';
import { DateTime } from 'luxon';

export default function hasAuthTokenExpired(authTokenOrExpiration :?string | number) :boolean {

  try {
    if (typeof authTokenOrExpiration === 'number' && Number.isFinite(authTokenOrExpiration)) {
      // authTokenOrExpiration is the expiration
      return DateTime.local().valueOf() > DateTime.fromMillis(authTokenOrExpiration).valueOf();
    }
    if (typeof authTokenOrExpiration === 'string' && authTokenOrExpiration.length) {
      // authTokenOrExpiration is the id token
      const authTokenDecoded = decode(authTokenOrExpiration);
      // Auth0 JWT tokens set the expiration date as seconds since the Unix Epoch, not milliseconds
      // https://auth0.com/docs/tokens/id-token#id-token-payload
      const expirationInMillis :number = authTokenDecoded.exp * 1000;
      return DateTime.local().valueOf() > DateTime.fromMillis(expirationInMillis).valueOf();
    }
    return true;
  }
  catch (e) {
    return true;
  }
}
