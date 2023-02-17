/*
 * @flow
 */

import cookies from 'js-cookie';

import getDomainForCookie from './getDomainForCookie';

import {
  AUTH0_ID_TOKEN,
  AUTH0_USER_INFO,
  AUTH_COOKIE,
  CSRF_COOKIE,
} from '../../../common/constants';

export default function clearAuthInfo() :void {

  localStorage.removeItem(AUTH0_ID_TOKEN);
  localStorage.removeItem(AUTH0_USER_INFO);

  // when deleting a cookie, we must pass the same "domain" and "path" values that were used to set the cookie
  // https://github.com/js-cookie/js-cookie
  cookies.remove(AUTH_COOKIE, {
    domain: getDomainForCookie(),
    path: '/',
  });

  cookies.remove(CSRF_COOKIE, {
    domain: getDomainForCookie(),
    path: '/',
  });
}
