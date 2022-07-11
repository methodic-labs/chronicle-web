/*
 * @flow
 */

import getLocalStorage from './getLocalStorage';
import isNonEmptyObject from './isNonEmptyObject';

import { getUserInfo } from '../../core/auth/utils';
import { ORGANIZATION_ID_MAP } from '../constants';
import type { UUID, UserInfo } from '../types';

export default function getOrgIdFromStorage() :?UUID {

  const user :?UserInfo = getUserInfo();
  if (!user) {
    throw new Error('cannot retrieve organization id without a valid login');
  }

  const { id } = user;
  if (!id) {
    throw new Error('cannot retrieve organization id because the current user does not have a valid user id');
  }

  const organizationIds = getLocalStorage(ORGANIZATION_ID_MAP);
  if (isNonEmptyObject(organizationIds)) {
    // $FlowFixMe
    return organizationIds[id] || null;
  }

  return null;
}
