/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, STUDIES, REQUEST_STATE } from '../../../common/constants';
import { CREATE_STUDY, createStudy } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return createStudy.reducer(state, action, {
    REQUEST: () => state
      .setIn([CREATE_STUDY, REQUEST_STATE], RequestStates.PENDING)
      .setIn([CREATE_STUDY, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([CREATE_STUDY, action.id])) {
        const study = action.value;
        return state
          .setIn([STUDIES, study.id], study)
          .setIn([CREATE_STUDY, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([CREATE_STUDY, action.id])) {
        return state
          .setIn([CREATE_STUDY, ERROR], action.value)
          .setIn([CREATE_STUDY, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([CREATE_STUDY, action.id]),
  });
}
