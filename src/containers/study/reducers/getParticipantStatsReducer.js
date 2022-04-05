/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, STATS } from '../../../common/constants';
import { GET_PARTICIPANT_STATS, getParticipantStats } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getParticipantStats.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_PARTICIPANT_STATS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_PARTICIPANT_STATS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([GET_PARTICIPANT_STATS, action.id]);
      if (storedAction) {
        const studyId = storedAction.value;
        return state
          .setIn([STATS, studyId], action.value)
          .setIn([GET_PARTICIPANT_STATS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_PARTICIPANT_STATS, action.id])) {
        return state
          .setIn([GET_PARTICIPANT_STATS, ERROR], action.value)
          .setIn([GET_PARTICIPANT_STATS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_PARTICIPANT_STATS, action.id]),
  });
}
