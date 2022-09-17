/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_DEVICE_USAGE_SURVEY_DATA :'GET_DEVICE_USAGE_SURVEY_DATA' = 'GET_DEVICE_USAGE_SURVEY_DATA';
const getDeviceUsageSurveyData :RequestSequence = newRequestSequence(GET_DEVICE_USAGE_SURVEY_DATA);

const SUBMIT_DEVICE_USAGE_SURVEY :'SUBMIT_DEVICE_USAGE_SURVEY' = 'SUBMIT_DEVICE_USAGE_SURVEY';
const submitDeviceUsageSurvey :RequestSequence = newRequestSequence(SUBMIT_DEVICE_USAGE_SURVEY);

export {
  GET_DEVICE_USAGE_SURVEY_DATA,
  SUBMIT_DEVICE_USAGE_SURVEY,
  getDeviceUsageSurveyData,
  submitDeviceUsageSurvey,
};
