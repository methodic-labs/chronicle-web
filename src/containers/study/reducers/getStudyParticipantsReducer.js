/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, PARTICIPANTS, REQUEST_STATE } from '../../../common/constants';
import { GET_STUDY_PARTICIPANTS, getStudyParticipants } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getStudyParticipants.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_STUDY_PARTICIPANTS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([GET_STUDY_PARTICIPANTS, action.id]);
      if (storedAction) {
        const studyId = storedAction.value;
        return state
          .setIn([PARTICIPANTS, studyId], action.value)
          .setIn([GET_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_STUDY_PARTICIPANTS, action.id])) {
        return state
          .setIn([GET_STUDY_PARTICIPANTS, ERROR], action.value)
          .setIn([GET_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_STUDY_PARTICIPANTS, action.id]),
  });
}
