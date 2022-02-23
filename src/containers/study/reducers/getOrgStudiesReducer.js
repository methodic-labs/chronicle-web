/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, STUDIES, REQUEST_STATE } from '../../../common/constants';
import { GET_ORG_STUDIES, getOrgStudies } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getOrgStudies.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_ORG_STUDIES, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_ORG_STUDIES, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([GET_ORG_STUDIES, action.id])) {
        return state
          .mergeIn([STUDIES], action.value)
          .setIn([GET_ORG_STUDIES, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_ORG_STUDIES, action.id])) {
        return state
          .setIn([GET_ORG_STUDIES, ERROR], action.value)
          .setIn([GET_ORG_STUDIES, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_ORG_STUDIES, action.id]),
  });
}
