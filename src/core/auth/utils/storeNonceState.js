/*
 * @flow
 */

import { AUTH0_NONCE_STATE } from '../../../common/constants';
import { isNonEmptyString } from '../../../common/utils';
import type { Auth0NonceState } from '../../../common/types';

export default function storeNonceState(state :string, value :Auth0NonceState) :void {

  if (!isNonEmptyString(state)) {
    return;
  }

  localStorage.setItem(AUTH0_NONCE_STATE, JSON.stringify({ [state]: value }));
}
