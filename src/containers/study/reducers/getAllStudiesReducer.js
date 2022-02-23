/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, STUDIES, REQUEST_STATE } from '../../../common/constants';
import { GET_ALL_STUDIES, getAllStudies } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getAllStudies.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_ALL_STUDIES, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_ALL_STUDIES, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([GET_ALL_STUDIES, action.id])) {
        return state
          .mergeIn([STUDIES], action.value)
          .setIn([GET_ALL_STUDIES, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_ALL_STUDIES, action.id])) {
        return state
          .setIn([GET_ALL_STUDIES, ERROR], action.value)
          .setIn([GET_ALL_STUDIES, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_ALL_STUDIES, action.id]),
  });
}
