/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { APP_USAGE_SURVEY_DATA, ERROR, REQUEST_STATE } from '../../../common/constants';
import { GET_APP_USAGE_SURVEY_DATA, getAppUsageSurveyData } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getAppUsageSurveyData.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_APP_USAGE_SURVEY_DATA, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_APP_USAGE_SURVEY_DATA, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([GET_APP_USAGE_SURVEY_DATA, action.id])) {
        return state
          .set(APP_USAGE_SURVEY_DATA, fromJS(action.value))
          .setIn([GET_APP_USAGE_SURVEY_DATA, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_APP_USAGE_SURVEY_DATA, action.id])) {
        return state
          .setIn([GET_APP_USAGE_SURVEY_DATA, ERROR], action.value)
          .setIn([GET_APP_USAGE_SURVEY_DATA, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_APP_USAGE_SURVEY_DATA, action.id]),
  });
}
