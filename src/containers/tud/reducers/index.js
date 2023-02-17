/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import getTimeUseDiarySubmissionsByDateRangeReducer from './getTimeUseDiarySubmissionsByDateRangeReducer';
import submitTimeUseDiaryReducer from './submitTimeUseDiaryReducer';

import {
  RS_INITIAL_STATE,
  TIME_USE_DIARY_SUBMISSIONS,
} from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { resetRequestStatesReducer } from '../../../core/redux/reducers';
import {
  GET_TUD_SUBMISSIONS_BY_DATE_RANGE,
  SUBMIT_TIME_USE_DIARY,
  getTimeUseDiarySubmissionsByDateRange,
  submitTimeUseDiary,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_TUD_SUBMISSIONS_BY_DATE_RANGE]: RS_INITIAL_STATE,
  [SUBMIT_TIME_USE_DIARY]: RS_INITIAL_STATE,
  // data
  [TIME_USE_DIARY_SUBMISSIONS]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }

    case getTimeUseDiarySubmissionsByDateRange.case(action.type): {
      return getTimeUseDiarySubmissionsByDateRangeReducer(state, action);
    }

    case submitTimeUseDiary.case(action.type): {
      return submitTimeUseDiaryReducer(state, action);
    }

    default: {
      return state;
    }
  }
}
