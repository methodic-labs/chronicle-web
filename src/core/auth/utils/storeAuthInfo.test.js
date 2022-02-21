/*
 * @flow
 */

import cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

import storeAuthInfo from './storeAuthInfo';

import {
  AUTH0_ID_TOKEN,
  AUTH0_USER_INFO,
  AUTH_COOKIE,
  CSRF_COOKIE,
} from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';
import type { UserInfo } from '../../../common/types';

const MOCK_URL = new URL('https://example.com/app/#/hello/world');
// $FlowIgnore
const MOCK_EXPIRATION_IN_SECONDS :number = DateTime.local().plus({ hours: 1 }).toSeconds(); // 1 hour ahead
const MOCK_CSRF_TOKEN :UUID = '40015ad9-fb3e-4741-9547-f7ac33cf4663';

const MOCK_AUTH_TOKEN :string = jwt.sign(
  {
    data: 'mock_data',
    // Auth0 JWT tokens set the expiration date as seconds since the Unix Epoch, not milliseconds
    exp: MOCK_EXPIRATION_IN_SECONDS,
  },
  'mock_secret',
);

const MOCK_AUTH0_PAYLOAD = {
  idToken: MOCK_AUTH_TOKEN,
  idTokenPayload: {
    email: 'test@example.com',
    family_name: 'James',
    given_name: 'Hetfield',
    name: 'James Hetfield',
    picture: genRandomString(),
    sub: genRandomString(),
    'getmethodic.com/metadata': {
      roles: ['TEST_ROLE_1', 'TEST_ROLE_2'],
    },
  },
};

jest.mock('js-cookie');
jest.mock('uuid');

describe('storeAuthInfo()', () => {

  beforeEach(() => {
    localStorage.clear();
    cookies.get.mockClear();
    cookies.remove.mockClear();
    cookies.set.mockClear();
    // $FlowIgnore
    uuid.mockClear();
  });

  test('should not store anything when given invalid auth info', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      storeAuthInfo(invalid);
      expect(localStorage).toHaveLength(0);
      expect(cookies.set).not.toHaveBeenCalled();
    });
  });

  describe('should set cookies - dev', () => {

    test(`"${AUTH_COOKIE}" cookie`, () => {
      storeAuthInfo(MOCK_AUTH0_PAYLOAD);
      expect(cookies.set).toHaveBeenCalledTimes(2);
      expect(cookies.set).toHaveBeenCalledWith(
        AUTH_COOKIE,
        `Bearer ${MOCK_AUTH_TOKEN}`,
        {
          SameSite: 'strict',
          domain: 'localhost',
          expires: new Date(MOCK_EXPIRATION_IN_SECONDS * 1000),
          path: '/',
          secure: false,
        }
      );
    });

    test(`"${CSRF_COOKIE}" cookie`, () => {
      // $FlowIgnore
      uuid.mockImplementationOnce(() => MOCK_CSRF_TOKEN);
      storeAuthInfo(MOCK_AUTH0_PAYLOAD);
      expect(cookies.set).toHaveBeenCalledTimes(2);
      expect(cookies.set).toHaveBeenCalledWith(
        CSRF_COOKIE,
        MOCK_CSRF_TOKEN,
        {
          SameSite: 'strict',
          domain: 'localhost',
          expires: new Date(MOCK_EXPIRATION_IN_SECONDS * 1000),
          path: '/',
          secure: false,
        }
      );
    });

  });

  describe('should set cookies - prod', () => {

    test(`"${AUTH_COOKIE}" cookie`, () => {
      global.jsdom.reconfigure({ url: MOCK_URL.toString() });
      storeAuthInfo(MOCK_AUTH0_PAYLOAD);
      expect(cookies.set).toHaveBeenCalledTimes(2);
      expect(cookies.set).toHaveBeenCalledWith(
        AUTH_COOKIE,
        `Bearer ${MOCK_AUTH_TOKEN}`,
        {
          SameSite: 'strict',
          domain: '.example.com',
          expires: new Date(MOCK_EXPIRATION_IN_SECONDS * 1000),
          path: '/',
          secure: true,
        }
      );
    });

    test(`"${CSRF_COOKIE}" cookie`, () => {
      // $FlowIgnore
      uuid.mockImplementationOnce(() => MOCK_CSRF_TOKEN);
      global.jsdom.reconfigure({ url: MOCK_URL.toString() });
      storeAuthInfo(MOCK_AUTH0_PAYLOAD);
      expect(cookies.set).toHaveBeenCalledTimes(2);
      expect(cookies.set).toHaveBeenCalledWith(
        CSRF_COOKIE,
        MOCK_CSRF_TOKEN,
        {
          SameSite: 'strict',
          domain: '.example.com',
          expires: new Date(MOCK_EXPIRATION_IN_SECONDS * 1000),
          path: '/',
          secure: true,
        }
      );
    });

  });

  test('should set cookies even if user info is missing', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.clear();
      // $FlowIgnore
      uuid.mockImplementationOnce(() => MOCK_CSRF_TOKEN);
      storeAuthInfo({ idToken: MOCK_AUTH_TOKEN, idTokenPayload: invalid });
      expect(cookies.set).toHaveBeenCalledTimes(2);
      expect(cookies.set).toHaveBeenCalledWith(AUTH_COOKIE, `Bearer ${MOCK_AUTH_TOKEN}`, expect.any(Object));
      expect(cookies.set).toHaveBeenCalledWith(CSRF_COOKIE, MOCK_CSRF_TOKEN, expect.any(Object));
      expect(localStorage).toHaveLength(1);
      expect(localStorage.getItem(AUTH0_ID_TOKEN)).toEqual(MOCK_AUTH_TOKEN);
      expect(localStorage.getItem(AUTH0_USER_INFO)).toBeNull();
      cookies.set.mockClear();
      // $FlowIgnore
      uuid.mockClear();
    });
  });

  test('should update localStorage with the correct user info', () => {

    const mockUserInfo :UserInfo = {
      email: MOCK_AUTH0_PAYLOAD.idTokenPayload.email,
      familyName: MOCK_AUTH0_PAYLOAD.idTokenPayload.family_name,
      givenName: MOCK_AUTH0_PAYLOAD.idTokenPayload.given_name,
      id: MOCK_AUTH0_PAYLOAD.idTokenPayload.sub,
      name: MOCK_AUTH0_PAYLOAD.idTokenPayload.name,
      picture: MOCK_AUTH0_PAYLOAD.idTokenPayload.picture,
      roles: MOCK_AUTH0_PAYLOAD.idTokenPayload['getmethodic.com/metadata'].roles,
    };

    // $FlowIgnore
    uuid.mockImplementationOnce(() => MOCK_CSRF_TOKEN);
    storeAuthInfo(MOCK_AUTH0_PAYLOAD);
    expect(cookies.set).toHaveBeenCalledTimes(2);
    expect(cookies.set).toHaveBeenCalledWith(AUTH_COOKIE, `Bearer ${MOCK_AUTH_TOKEN}`, expect.any(Object));
    expect(cookies.set).toHaveBeenCalledWith(CSRF_COOKIE, MOCK_CSRF_TOKEN, expect.any(Object));
    expect(localStorage).toHaveLength(2);
    expect(localStorage.getItem(AUTH0_ID_TOKEN)).toEqual(MOCK_AUTH_TOKEN);
    expect(localStorage.getItem(AUTH0_USER_INFO)).toEqual(JSON.stringify(mockUserInfo));
  });

});
