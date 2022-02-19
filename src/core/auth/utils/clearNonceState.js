/*
 * @flow
 */

import { AUTH0_NONCE_STATE } from '../../../common/constants';

export default function clearNonceState() {

  localStorage.removeItem(AUTH0_NONCE_STATE);
}
