// @flow

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import sendMessageReducer from './sendMessageReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/ReduxActions';
import {
  SEND_MESSAGE,
  sendMessage
} from '../actions';

const { REQUEST_STATE } = ReduxConstants;

const INITIAL_STATE = fromJS({
  [SEND_MESSAGE]: { [REQUEST_STATE]: RequestStates.STANDBY },
});

export default function timeUseDiaryReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case RESET_REQUEST_STATE: {
      const { actionType } = action;
      if (actionType && state.has(actionType)) {
        return state.setIn([actionType, REQUEST_STATE], RequestStates.STANDBY);
      }
      return state;
    }

    case sendMessage.case(action.type): {
      return sendMessageReducer(state, action);
    }

    default:
      return state;
  }
}
