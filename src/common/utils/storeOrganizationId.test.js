/*
 * @flow
 */

import storeOrganizationId from './storeOrganizationId';
import { genRandomString } from './testing';

import { AUTH0_USER_INFO, ORGANIZATION_ID_MAP } from '../constants';

const MOCK_USER_ID = genRandomString();
const MOCK_ORG_ID = genRandomString();

const MOCK_USER_INFO = JSON.stringify({
  id: MOCK_USER_ID
});

describe('storeOrganizationId()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should throw if organizationId parameter is not passed', () => {
    localStorage.setItem(AUTH0_USER_INFO, MOCK_USER_INFO);
    // $FlowIgnore
    expect(() => storeOrganizationId()).toThrow();
  });

  test('should throw if there is no user info in localStorage', () => {
    expect(() => storeOrganizationId(MOCK_ORG_ID)).toThrow();
  });

  test('should store organization id for current user', () => {
    localStorage.setItem(AUTH0_USER_INFO, MOCK_USER_INFO);
    storeOrganizationId(MOCK_ORG_ID);
    // $FlowIgnore
    expect(JSON.parse(localStorage.getItem(ORGANIZATION_ID_MAP))[MOCK_USER_ID]).toEqual(MOCK_ORG_ID);
  });

});
