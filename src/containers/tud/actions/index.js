/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_TUD_SUBMISSIONS_BY_DATE_RANGE :'GET_TUD_SUBMISSIONS_BY_DATE_RANGE' = 'GET_TUD_SUBMISSIONS_BY_DATE_RANGE';
const getTimeUseDiarySubmissionsByDateRange :RequestSequence = newRequestSequence(GET_TUD_SUBMISSIONS_BY_DATE_RANGE);

const SUBMIT_TIME_USE_DIARY :'SUBMIT_TIME_USE_DIARY' = 'SUBMIT_TIME_USE_DIARY';
const submitTimeUseDiary :RequestSequence = newRequestSequence(SUBMIT_TIME_USE_DIARY);

export {
  GET_TUD_SUBMISSIONS_BY_DATE_RANGE,
  SUBMIT_TIME_USE_DIARY,
  getTimeUseDiarySubmissionsByDateRange,
  submitTimeUseDiary,
};
