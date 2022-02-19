/*
 * @flow
 */

import clearNonceState from './clearNonceState';

import { AUTH0_NONCE_STATE, AUTH0_USER_INFO } from '../../../common/constants';
import { genRandomString } from '../../../common/utils/testing';

jest.mock('js-cookie');

describe('clearNonceState()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test(`should remove ${AUTH0_NONCE_STATE} from localStorage`, () => {
    localStorage.setItem(AUTH0_NONCE_STATE, genRandomString()); // the value doesn't matter
    clearNonceState();
    expect(localStorage).toHaveLength(0);
    expect(localStorage.getItem(AUTH0_NONCE_STATE)).toBeNull();
  });

  test(`should only remove ${AUTH0_NONCE_STATE} from localStorage`, () => {
    localStorage.setItem(AUTH0_NONCE_STATE, genRandomString()); // the value doesn't matter
    localStorage.setItem(AUTH0_USER_INFO, genRandomString()); // the value doesn't matter
    clearNonceState();
    expect(localStorage).toHaveLength(1);
    expect(localStorage.getItem(AUTH0_NONCE_STATE)).toBeNull();
    expect(localStorage.getItem(AUTH0_USER_INFO)).not.toBeNull();
  });

});
