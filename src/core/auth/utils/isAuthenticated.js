/*
 * @flow
 */

import getAuthTokenExpiration from './getAuthTokenExpiration';
import hasAuthTokenExpired from './hasAuthTokenExpired';

export default function isAuthenticated() :boolean {

  return !hasAuthTokenExpired(getAuthTokenExpiration());
}
