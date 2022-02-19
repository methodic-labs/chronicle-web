/*
 * @flow
 */

import cookies from 'js-cookie';

import { CSRF_COOKIE } from '../../../common/constants';
import type { UUID } from '../../../common/types';

// https://github.com/chriso/validator.js/blob/master/src/lib/isUUID.js
const BASE_UUID_PATTERN :RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

export default function getCSRFToken() :?UUID {

  const csrfToken :?UUID = cookies.get(CSRF_COOKIE);
  if (typeof csrfToken === 'string' && BASE_UUID_PATTERN.test(csrfToken)) {
    return csrfToken;
  }

  return null;
}
