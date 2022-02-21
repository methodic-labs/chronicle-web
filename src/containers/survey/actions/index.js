/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_APP_USAGE_SURVEY_DATA :'GET_APP_USAGE_SURVEY_DATA' = 'GET_APP_USAGE_SURVEY_DATA';
const getAppUsageSurveyData :RequestSequence = newRequestSequence(GET_APP_USAGE_SURVEY_DATA);

const SUBMIT_APP_USAGE_SURVEY :'SUBMIT_APP_USAGE_SURVEY' = 'SUBMIT_APP_USAGE_SURVEY';
const submitAppUsageSurvey :RequestSequence = newRequestSequence(SUBMIT_APP_USAGE_SURVEY);

export {
  GET_APP_USAGE_SURVEY_DATA,
  SUBMIT_APP_USAGE_SURVEY,
  getAppUsageSurveyData,
  submitAppUsageSurvey,
};
