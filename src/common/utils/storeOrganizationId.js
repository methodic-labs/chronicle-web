/*
 * @flow
 */

import { LangUtils } from 'lattice-utils';

import getLocalStorage from './getLocalStorage';

import { getUserInfo } from '../../core/auth/utils';
import { ORGANIZATION_ID_MAP } from '../constants';
import type { UUID, UserInfo } from '../types';

const { isNonEmptyString } = LangUtils;

export default function storeOrganizationId(organizationId :UUID) {

  if (!isNonEmptyString(organizationId)) {
    throw new Error('organizationId must be a non-empty string');
  }

  const user :?UserInfo = getUserInfo();
  if (!user) {
    throw new Error('cannot store organization id without a valid login');
  }

  const { id } = user;
  if (!id) {
    throw new Error('cannot store organization id because the current user does not have a valid user id');
  }

  const organizationIds = getLocalStorage(ORGANIZATION_ID_MAP);
  const nextOrganizationIds = { ...organizationIds, [id]: organizationId };
  localStorage.setItem(ORGANIZATION_ID_MAP, JSON.stringify(nextOrganizationIds));
}
