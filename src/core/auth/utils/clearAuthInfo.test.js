/*
 * @flow
 */

import cookies from 'js-cookie';

import clearAuthInfo from './clearAuthInfo';

import {
  AUTH0_ID_TOKEN,
  AUTH0_USER_INFO,
  AUTH_COOKIE,
  CSRF_COOKIE,
} from '../../../common/constants';
import { genRandomString } from '../../../common/utils/testing';

jest.mock('js-cookie');

describe('clearAuthInfo()', () => {

  beforeEach(() => {
    localStorage.clear();
    cookies.get.mockClear();
    cookies.remove.mockClear();
    cookies.set.mockClear();
  });

  test('should remove all cookies', () => {
    clearAuthInfo();
    expect(cookies.remove).toHaveBeenCalledTimes(2);
    expect(cookies.remove).toHaveBeenCalledWith(AUTH_COOKIE, { domain: 'localhost', path: '/' });
    expect(cookies.remove).toHaveBeenCalledWith(CSRF_COOKIE, { domain: 'localhost', path: '/' });
  });

  test(`should remove ${AUTH0_ID_TOKEN} from localStorage`, () => {
    localStorage.setItem(AUTH0_ID_TOKEN, genRandomString()); // the value doesn't matter
    clearAuthInfo();
    expect(localStorage).toHaveLength(0);
    expect(localStorage.getItem(AUTH0_ID_TOKEN)).toBeNull();
  });

  test(`should remove "${AUTH0_USER_INFO}" from localStorage`, () => {
    localStorage.setItem(AUTH0_USER_INFO, genRandomString()); // the value doesn't matter
    clearAuthInfo();
    expect(localStorage).toHaveLength(0);
    expect(localStorage.getItem(AUTH0_USER_INFO)).toBeNull();
  });

});
