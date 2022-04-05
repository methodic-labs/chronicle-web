/*
 * @flow
 */

import { LangUtils } from 'lattice-utils';

import { AUTH0_NONCE_STATE } from '../../../common/constants';
import type { Auth0NonceState } from '../../../common/types';

const { isNonEmptyString } = LangUtils;

export default function storeNonceState(state :string, value :Auth0NonceState) :void {

  if (!isNonEmptyString(state)) {
    return;
  }

  localStorage.setItem(AUTH0_NONCE_STATE, JSON.stringify({ [state]: value }));
}
