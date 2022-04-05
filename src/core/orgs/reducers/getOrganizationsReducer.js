/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, ORGANIZATIONS, REQUEST_STATE } from '../../../common/constants';
import { GET_ORGANIZATIONS, getOrganizations } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getOrganizations.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_ORGANIZATIONS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_ORGANIZATIONS, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([GET_ORGANIZATIONS, action.id])) {
        return state
          .setIn([ORGANIZATIONS], action.value)
          .setIn([GET_ORGANIZATIONS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_ORGANIZATIONS, action.id])) {
        return state
          .setIn([GET_ORGANIZATIONS, ERROR], action.value)
          .setIn([GET_ORGANIZATIONS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_ORGANIZATIONS, action.id]),
  });
}
