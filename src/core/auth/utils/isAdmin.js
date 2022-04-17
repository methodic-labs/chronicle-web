/*
 * @flow
 */

import getUserInfo from './getUserInfo';

import { ADMIN } from '../../../common/constants';
import type { UserInfo } from '../../../common/types';

export default function isAdmin() :boolean {

  let hasAdminRole :boolean = false;
  const userInfo :?UserInfo = getUserInfo();

  if (userInfo && userInfo.roles && userInfo.roles.length > 0) {

    userInfo.roles.forEach((role :string) => {
      if (role === ADMIN) {
        hasAdminRole = true;
      }
    });
  }

  return hasAdminRole;
}
