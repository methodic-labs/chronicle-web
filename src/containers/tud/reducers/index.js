/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import submitTimeUseDiaryReducer from './submitTimeUseDiaryReducer';

import {
  RS_INITIAL_STATE,
} from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { resetRequestStatesReducer } from '../../../core/redux/reducers';
import {
  SUBMIT_TIME_USE_DIARY,
  submitTimeUseDiary,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [SUBMIT_TIME_USE_DIARY]: RS_INITIAL_STATE,
  // data
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }

    case submitTimeUseDiary.case(action.type): {
      return submitTimeUseDiaryReducer(state, action);
    }

    default: {
      return state;
    }
  }
}
