/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import getAppUsageSurveyDataReducer from './getAppUsageSurveyDataReducer';
import submitAppUsageSurveyReducer from './submitAppUsageSurveyReducer';

import {
  APP_USAGE_SURVEY_DATA,
  RS_INITIAL_STATE,
} from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { resetRequestStatesReducer } from '../../../core/redux/reducers';
import {
  GET_APP_USAGE_SURVEY_DATA,
  SUBMIT_APP_USAGE_SURVEY,
  getAppUsageSurveyData,
  submitAppUsageSurvey,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_APP_USAGE_SURVEY_DATA]: RS_INITIAL_STATE,
  [SUBMIT_APP_USAGE_SURVEY]: RS_INITIAL_STATE,
  // data
  [APP_USAGE_SURVEY_DATA]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }

    case getAppUsageSurveyData.case(action.type): {
      return getAppUsageSurveyDataReducer(state, action);
    }

    case submitAppUsageSurvey.case(action.type): {
      return submitAppUsageSurveyReducer(state, action);
    }

    default: {
      return state;
    }
  }
}
