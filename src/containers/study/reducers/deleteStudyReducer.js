// @flow

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, STUDIES } from '../../../common/constants';
import { DELETE_STUDY, deleteStudy } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return deleteStudy.reducer(state, action, {
    REQUEST: () => state
      .setIn([DELETE_STUDY, REQUEST_STATE], RequestStates.PENDING)
      .setIn([DELETE_STUDY, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([DELETE_STUDY, action.id])) {
        const studyId = action.value;
        return state
          .delete(STUDIES, studyId)
          .setIn([DELETE_STUDY, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([DELETE_STUDY, action.id])) {
        return state
          .setIn([DELETE_STUDY, ERROR], action.value)
          .setIn([DELETE_STUDY, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([DELETE_STUDY, action.id]),
  });
}
