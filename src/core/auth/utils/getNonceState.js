/*
 * @flow
 */

import _has from 'lodash/has';

import { AUTH0_NONCE_STATE } from '../../../common/constants';
import type { Auth0NonceState } from '../../../common/types';

export default function getNonceState(state :string) :?Auth0NonceState {

  const nonce :?string = localStorage.getItem(AUTH0_NONCE_STATE);
  if (typeof nonce !== 'string' || nonce.length <= 0) {
    return null;
  }

  try {
    const nonceObj = JSON.parse(nonce);
    if (_has(nonceObj, state)) {
      return nonceObj[state];
    }
  }
  catch (e) {
    return null;
  }

  return null;
}
