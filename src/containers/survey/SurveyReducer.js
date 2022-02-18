// @flow

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_APP_USAGE_SURVEY_DATA,
  SUBMIT_SURVEY,
  getAppUsageSurveyData,
  submitSurvey,
} from './SurveyActions';

import { RESET_REQUEST_STATE } from '../../core/redux/ReduxActions';

const { REQUEST_STATE } = ReduxConstants;

const INITIAL_STATE :Map = fromJS({
  [GET_APP_USAGE_SURVEY_DATA]: { [REQUEST_STATE]: RequestStates.STANDBY },
  [SUBMIT_SURVEY]: { [REQUEST_STATE]: RequestStates.STANDBY },
  appsData: Map()
});

export default function surveyReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case RESET_REQUEST_STATE: {
      const { actionType } = action;
      if (actionType && state.has(actionType)) {
        return state.setIn([actionType, REQUEST_STATE], RequestStates.STANDBY);
      }
      return state;
    }

    case getAppUsageSurveyData.case(action.type): {
      const seqAction :SequenceAction = action;
      return getAppUsageSurveyData.reducer(state, action, {
        REQUEST: () => state.setIn([GET_APP_USAGE_SURVEY_DATA, REQUEST_STATE], RequestStates.PENDING),
        FAILURE: () => state.setIn([GET_APP_USAGE_SURVEY_DATA, REQUEST_STATE], RequestStates.FAILURE),
        SUCCESS: () => state
          .set('appsData', fromJS(seqAction.value))
          .setIn([GET_APP_USAGE_SURVEY_DATA, REQUEST_STATE], RequestStates.SUCCESS)
      });
    }

    case submitSurvey.case(action.type): {
      return submitSurvey.reducer(state, action, {
        REQUEST: () => state.setIn([SUBMIT_SURVEY, REQUEST_STATE], RequestStates.PENDING),
        FAILURE: () => state.setIn([SUBMIT_SURVEY, REQUEST_STATE], RequestStates.FAILURE),
        SUCCESS: () => state.setIn([SUBMIT_SURVEY, REQUEST_STATE], RequestStates.SUCCESS)
      });
    }
    default:
      return state;
  }
}
