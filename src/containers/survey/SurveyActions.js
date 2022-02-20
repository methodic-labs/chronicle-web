// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_APP_USAGE_SURVEY_DATA :'GET_APP_USAGE_SURVEY_DATA' = 'GET_APP_USAGE_SURVEY_DATA';
const getAppUsageSurveyData :RequestSequence = newRequestSequence(GET_APP_USAGE_SURVEY_DATA);

const SUBMIT_SURVEY :'SUBMIT_SURVEY' = 'SUBMIT_SURVEY';
const submitSurvey :RequestSequence = newRequestSequence(SUBMIT_SURVEY);

export {
  GET_APP_USAGE_SURVEY_DATA,
  SUBMIT_SURVEY,
  getAppUsageSurveyData,
  submitSurvey,
};
