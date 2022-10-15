/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CANDIDATE_ID,
  ERROR,
  PARTICIPANTS,
  PARTICIPATION_STATUS,
  REQUEST_STATE,
  STUDY_ID
} from '../../../common/constants';
import { CHANGE_ENROLLMENT_STATUS, changeEnrollmentStatus } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return changeEnrollmentStatus.reducer(state, action, {
    REQUEST: () => state
      .setIn([CHANGE_ENROLLMENT_STATUS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([CHANGE_ENROLLMENT_STATUS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([CHANGE_ENROLLMENT_STATUS, action.id]);
      if (storedAction) {
        const candidateId = action.value[CANDIDATE_ID];
        const studyId = action.value[STUDY_ID];
        const participationStatus = action.value[PARTICIPATION_STATUS];
        return state
          .setIn([PARTICIPANTS, studyId, candidateId, PARTICIPATION_STATUS], participationStatus)
          .setIn([CHANGE_ENROLLMENT_STATUS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([CHANGE_ENROLLMENT_STATUS, action.id])) {
        return state
          .setIn([CHANGE_ENROLLMENT_STATUS, ERROR], action.value)
          .setIn([CHANGE_ENROLLMENT_STATUS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([CHANGE_ENROLLMENT_STATUS, action.id]),
  });
}
