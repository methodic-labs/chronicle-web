// @flow

import { Map } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import type { ResetRequestStateAction } from '../ReduxActions';

const { REQUEST_STATE } = ReduxConstants;

export default function resetRequestStateReducer(state :Map, action :ResetRequestStateAction) {
  const { actionType } = action;
  if (actionType && state.has(actionType)) {
    return state.setIn([actionType, REQUEST_STATE], RequestStates.STANDBY);
  }
  return state;
}
