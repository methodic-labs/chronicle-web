/*
 * @flow
 */

import getOrgIdFromStorage from './getOrgIdFromStorage';
import { genRandomString } from './testing';

import { AUTH0_USER_INFO, ORGANIZATION_ID_MAP } from '../constants';

const MOCK_USER_ID = genRandomString();
const MOCK_ORG_ID = genRandomString();

const MOCK_USER_INFO = JSON.stringify({
  id: MOCK_USER_ID
});

const MOCK_ORG_ID_MAP = JSON.stringify({
  [MOCK_USER_ID]: MOCK_ORG_ID
});

describe('getOrgIdFromStorage()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should throw if there is no user info in localStorage', () => {
    expect(() => getOrgIdFromStorage()).toThrow();
  });

  test('should return null if there is no organization id stored for the current user', () => {
    localStorage.setItem(AUTH0_USER_INFO, JSON.stringify({ id: genRandomString() }));
    expect(getOrgIdFromStorage()).toBeNull();
  });

  test('should return null if localStorage parameter has not been set', () => {
    localStorage.setItem(AUTH0_USER_INFO, MOCK_USER_INFO);
    expect(getOrgIdFromStorage()).toBeNull();
  });

  test('should correctly return stored organization id for user', () => {
    localStorage.setItem(AUTH0_USER_INFO, MOCK_USER_INFO);
    localStorage.setItem(ORGANIZATION_ID_MAP, MOCK_ORG_ID_MAP);
    expect(getOrgIdFromStorage()).toEqual(MOCK_ORG_ID);
  });
});
