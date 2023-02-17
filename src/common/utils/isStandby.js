/*
 * @flow
 */

import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

export default function requestIsStandby(requestState :?RequestState) :boolean {
  return requestState === RequestStates.STANDBY;
}
