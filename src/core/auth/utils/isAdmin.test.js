/*
 * @flow
 */

import isAdmin from './isAdmin';

import { ADMIN, AUTH0_USER_INFO } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';
import type { UserInfo } from '../../../common/types';

describe('isAdmin()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should return false if the user info is not in localStorage', () => {
    expect(isAdmin()).toEqual(false);
  });

  test('should return false if the stored user info is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.setItem(AUTH0_USER_INFO, invalid);
      expect(isAdmin()).toEqual(false);
    });
  });

  test(`should return false if the stored user info does not have the "${ADMIN}" role`, () => {

    const mockUserInfo :UserInfo = {};
    localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
    expect(isAdmin()).toEqual(false);

    INVALID_PARAMS.forEach((invalid :any) => {
      mockUserInfo.roles = [invalid];
      localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
      expect(isAdmin()).toEqual(false);
      mockUserInfo.roles = [invalid, invalid];
      localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
      expect(isAdmin()).toEqual(false);
    });
  });

  test(`should return false because the "${ADMIN}" role is case sensitive`, () => {

    const mockUserInfo :UserInfo = { roles: ['ADMIN', 'Admin'] };
    localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
    expect(isAdmin()).toEqual(false);
  });

  test(`should return true if the stored user info contains the "${ADMIN}" role`, () => {

    const mockUserInfo :UserInfo = { roles: [ADMIN] };
    localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
    expect(isAdmin()).toEqual(true);

    mockUserInfo.roles = [genRandomString(), ADMIN];
    localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
    expect(isAdmin()).toEqual(true);
  });

});
