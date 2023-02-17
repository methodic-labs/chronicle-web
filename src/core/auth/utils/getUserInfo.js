/*
 * @flow
 */

import { AUTH0_USER_INFO } from '../../../common/constants';
import { isNonEmptyObject } from '../../../common/utils';
import type { UserInfo } from '../../../common/types';

export default function getUserInfo() :?UserInfo {

  const userInfoStr :?string = localStorage.getItem(AUTH0_USER_INFO);

  if (typeof userInfoStr !== 'string' || userInfoStr.length <= 0) {
    return null;
  }

  try {
    const userInfoObj = JSON.parse(userInfoStr);
    return isNonEmptyObject(userInfoObj) ? userInfoObj : null;
  }
  catch (error) {
    return null;
  }
}
