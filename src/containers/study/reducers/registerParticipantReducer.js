/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CANDIDATE,
  ERROR,
  ID,
  PARTICIPANTS,
  REQUEST_STATE,
  STUDY_ID,
} from '../../../common/constants';
import { REGISTER_PARTICIPANT, registerParticipant } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return registerParticipant.reducer(state, action, {
    REQUEST: () => state
      .setIn([REGISTER_PARTICIPANT, REQUEST_STATE], RequestStates.PENDING)
      .setIn([REGISTER_PARTICIPANT, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([REGISTER_PARTICIPANT, action.id]);
      if (storedAction) {
        const studyId = storedAction.value[STUDY_ID];
        const candidateId = action.value[CANDIDATE][ID];
        return state
          .setIn([PARTICIPANTS, studyId, candidateId], fromJS(action.value))
          .setIn([REGISTER_PARTICIPANT, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([REGISTER_PARTICIPANT, action.id])) {
        return state
          .setIn([REGISTER_PARTICIPANT, ERROR], action.value)
          .setIn([REGISTER_PARTICIPANT, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([REGISTER_PARTICIPANT, action.id]),
  });
}
