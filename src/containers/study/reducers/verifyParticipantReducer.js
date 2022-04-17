/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../common/constants';
import { VERIFY_PARTICIPANT, verifyParticipant } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return verifyParticipant.reducer(state, action, {
    REQUEST: () => state.setIn([VERIFY_PARTICIPANT, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state.setIn([VERIFY_PARTICIPANT, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([VERIFY_PARTICIPANT, REQUEST_STATE], RequestStates.FAILURE),
  });
}
