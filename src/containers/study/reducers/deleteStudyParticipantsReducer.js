/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CANDIDATE_IDS,
  ERROR,
  PARTICIPANTS,
  REQUEST_STATE,
  STUDY_ID,
} from '../../../common/constants';
import { DELETE_STUDY_PARTICIPANTS, deleteStudyParticipants } from '../actions';
import type { UUID } from '../../../common/types';

export default function reducer(state :Map, action :SequenceAction) {
  return deleteStudyParticipants.reducer(state, action, {
    REQUEST: () => state
      .setIn([DELETE_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([DELETE_STUDY_PARTICIPANTS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([DELETE_STUDY_PARTICIPANTS, action.id]);
      if (storedAction) {
        const studyId = storedAction.value[STUDY_ID];
        let newState = state;
        storedAction.value[CANDIDATE_IDS].forEach((candidateId :UUID) => {
          newState = newState.deleteIn([PARTICIPANTS, studyId, candidateId]);
        });
        return newState
          .setIn([DELETE_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([DELETE_STUDY_PARTICIPANTS, action.id])) {
        return state
          .setIn([DELETE_STUDY_PARTICIPANTS, ERROR], action.value)
          .setIn([DELETE_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([DELETE_STUDY_PARTICIPANTS, action.id]),
  });
}
