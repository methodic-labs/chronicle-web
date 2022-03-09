// @flow

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, STUDIES } from '../../../common/constants';
import { UPDATE_STUDY, updateStudy } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return updateStudy.reducer(state, action, {
    REQUEST: () => state
      .setIn([UPDATE_STUDY, REQUEST_STATE], RequestStates.PENDING)
      .setIn([UPDATE_STUDY, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([UPDATE_STUDY, action.id])) {
        const study = action.value;
        return state
          .setIn([STUDIES, study.id], study)
          .setIn([UPDATE_STUDY, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([UPDATE_STUDY, action.id])) {
        return state
          .setIn([UPDATE_STUDY, ERROR], action.value)
          .setIn([UPDATE_STUDY, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([UPDATE_STUDY, action.id]),
  });
}
