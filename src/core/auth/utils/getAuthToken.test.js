/*
 * @flow
 */

import cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import getAuthToken from './getAuthToken';

import { AUTH0_ID_TOKEN } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';

// $FlowIgnore
const MOCK_EXPIRATION_IN_SECONDS :number = DateTime.local().plus({ hours: 1 }).toSeconds(); // 1 hour ahead
const MOCK_AUTH_TOKEN :string = jwt.sign(
  {
    data: 'mock_data',
    // Auth0 JWT tokens set the expiration date as seconds since the Unix Epoch, not milliseconds
    exp: MOCK_EXPIRATION_IN_SECONDS,
  },
  'mock_secret',
);

jest.mock('js-cookie');

describe('getAuthToken()', () => {

  beforeEach(() => {
    localStorage.clear();
    cookies.get.mockClear();
    cookies.remove.mockClear();
    cookies.set.mockClear();
  });

  test('should return null if the stored auth token is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.setItem(AUTH0_ID_TOKEN, invalid);
      expect(getAuthToken()).toBeNull();
      expect(cookies.get).not.toHaveBeenCalled();
    });
  });

  test('should return the stored auth token', () => {
    localStorage.setItem(AUTH0_ID_TOKEN, MOCK_AUTH_TOKEN);
    expect(getAuthToken()).toEqual(MOCK_AUTH_TOKEN);
    expect(cookies.get).not.toHaveBeenCalled();
  });

});
