/*
 * @flow
 */

import getNonceState from './getNonceState';

import { AUTH0_NONCE_STATE } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';

describe('getNonceState()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should return null if the stored nonce state is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.setItem(AUTH0_NONCE_STATE, invalid);
      expect(getNonceState('test')).toBeNull();
    });
  });

  test('should return the stored nonce state', () => {
    const mockNonceState = genRandomString();
    const mockValue = { id: genRandomString() };
    localStorage.setItem(AUTH0_NONCE_STATE, JSON.stringify({ [mockNonceState]: mockValue }));
    expect(getNonceState(mockNonceState)).toEqual(mockValue);
  });

});
