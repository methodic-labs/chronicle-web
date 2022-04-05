/*
 * @flow
 */

import cookies from 'js-cookie';

import getCSRFToken from './getCSRFToken';

import { CSRF_COOKIE } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';

const MOCK_CSRF_TOKEN :UUID = '40015ad9-fb3e-4741-9547-f7ac33cf4663';

jest.mock('js-cookie');

describe('getCSRFToken', () => {

  beforeEach(() => {
    localStorage.clear();
    cookies.get.mockClear();
    cookies.remove.mockClear();
    cookies.set.mockClear();
  });

  test('should return null if the stored csrf token is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      cookies.get.mockImplementationOnce(() => invalid);
      expect(getCSRFToken()).toBeNull();
      expect(cookies.get).toHaveBeenCalledTimes(1);
      expect(cookies.get).toHaveBeenCalledWith(CSRF_COOKIE);
      cookies.get.mockClear();
    });
  });

  test('should return the stored csrf token', () => {
    cookies.get.mockImplementationOnce(() => MOCK_CSRF_TOKEN);
    expect(getCSRFToken()).toEqual(MOCK_CSRF_TOKEN);
    expect(cookies.get).toHaveBeenCalledTimes(1);
    expect(cookies.get).toHaveBeenCalledWith(CSRF_COOKIE);
  });

});
