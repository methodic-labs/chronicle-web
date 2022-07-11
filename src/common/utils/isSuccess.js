/*
 * @flow
 */

import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

export default function isSuccess(requestState :?RequestState) :boolean {
  return requestState === RequestStates.SUCCESS;
}
