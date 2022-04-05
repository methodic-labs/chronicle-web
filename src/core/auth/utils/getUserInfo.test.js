/*
 * @flow
 */

import getUserInfo from './getUserInfo';

import { AUTH0_USER_INFO } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';
import type { UserInfo } from '../../../common/types';

describe('getUserInfo()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should return null if the user info is not in localStorage', () => {
    expect(getUserInfo()).toBeNull();
  });

  test('should return null if the stored user info is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.setItem(AUTH0_USER_INFO, invalid);
      expect(getUserInfo()).toBeNull();
    });
  });

  test('should return the stored user info', () => {

    const mockUserInfo :UserInfo = {
      email: genRandomString(),
      familyName: genRandomString(),
      givenName: genRandomString(),
      id: genRandomString(),
      name: genRandomString(),
      picture: genRandomString(),
      roles: [genRandomString()]
    };

    localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(mockUserInfo));
    expect(getUserInfo()).toEqual(mockUserInfo);
  });

});
