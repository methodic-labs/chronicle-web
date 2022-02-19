/*
 * @flow
 */

import cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { List } from 'immutable';
import { DateTime } from 'luxon';

import getAuthTokenExpiration from './getAuthTokenExpiration';

import { AUTH0_ID_TOKEN, AUTH_TOKEN_EXPIRED } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';

jest.mock('js-cookie');

describe('getAuthTokenExpiration()', () => {

  beforeEach(() => {
    localStorage.clear();
    cookies.get.mockClear();
    cookies.remove.mockClear();
    cookies.set.mockClear();
  });

  test('should return -1 if the stored auth token is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.setItem(AUTH0_ID_TOKEN, invalid);
      expect(getAuthTokenExpiration()).toEqual(AUTH_TOKEN_EXPIRED);
      expect(cookies.get).not.toHaveBeenCalled();
    });
  });

  test('should return -1 if given an invalid value', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      expect(getAuthTokenExpiration(invalid)).toEqual(AUTH_TOKEN_EXPIRED);
      expect(cookies.get).not.toHaveBeenCalled();
    });
  });

  test('should return -1 if given an invalid value even if the stored auth token is valid', () => {
    List(INVALID_PARAMS)
      .delete(0) // remove undefined
      .delete(0) // remove null
      .forEach((invalid :any) => {
        expect(getAuthTokenExpiration(invalid)).toEqual(AUTH_TOKEN_EXPIRED);
        expect(cookies.get).not.toHaveBeenCalled();
      });
  });

  test('should return the correct expiration', () => {
    const futureDateTime = DateTime.local().plus({ hours: 1 });
    // $FlowIgnore
    const expInSecondsSinceEpoch :number = futureDateTime.toSeconds();
    const expInMillisSinceEpoch :number = futureDateTime.toMillis();
    const mockAuthToken :string = jwt.sign({ data: genRandomString(), exp: expInSecondsSinceEpoch }, 'secret');
    localStorage.setItem(AUTH0_ID_TOKEN, mockAuthToken);
    expect(getAuthTokenExpiration()).toEqual(expInMillisSinceEpoch);
    expect(cookies.get).not.toHaveBeenCalled();
  });

});
