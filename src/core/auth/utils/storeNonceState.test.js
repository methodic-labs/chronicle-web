/*
 * @flow
 */

import { List } from 'immutable';

import storeNonceState from './storeNonceState';

import { AUTH0_NONCE_STATE } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';

describe('storeNonceState()', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('should not store anything when given invalid params', () => {
    List(INVALID_PARAMS)
      .delete(16) // remove "invalid_special_string_value"
      .forEach((invalid :any) => {
        // $FlowIgnore
        storeNonceState(invalid, { id: 'test' });
        expect(localStorage).toHaveLength(0);
      });
  });

  test('should update localStorage with the correct nonce state', () => {
    const mockNonceState = genRandomString();
    const mockValue = { id: genRandomString() };
    // $FlowIgnore
    storeNonceState(mockNonceState, mockValue);
    expect(localStorage).toHaveLength(1);
    expect(localStorage.getItem(AUTH0_NONCE_STATE)).toEqual(JSON.stringify({ [mockNonceState]: mockValue }));
  });

});
