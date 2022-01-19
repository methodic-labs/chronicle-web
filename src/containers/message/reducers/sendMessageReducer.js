// @flow

import { Map } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import {
  SEND_MESSAGE,
  sendMessage
} from '../actions';

const { REQUEST_STATE } = ReduxConstants;

export default function sendMessageReducer(state :Map, action :Object) {
  return sendMessage.reducer(state, action, {
    REQUEST: () => state.setIn([SEND_MESSAGE, REQUEST_STATE], RequestStates.PENDING),
    FAILURE: () => state.setIn([SEND_MESSAGE, REQUEST_STATE], RequestStates.FAILURE),
    SUCCESS: () => state.setIn([SEND_MESSAGE, REQUEST_STATE], RequestStates.SUCCESS)
  });
}
