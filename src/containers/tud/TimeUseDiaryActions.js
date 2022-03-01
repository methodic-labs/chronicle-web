// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_SUBMISSIONS_BY_DATE :'GET_SUBMISSIONS_BY_DATE' = 'GET_SUBMISSIONS_BY_DATE';
const getSubmissionsByDate :RequestSequence = newRequestSequence(GET_SUBMISSIONS_BY_DATE);

const GET_TUD_SUBMISSION_DATES :'GET_TUD_SUBMISSION_DATES' = 'GET_TUD_SUBMISSION_DATES';
const getTudSubmissionDates :RequestSequence = newRequestSequence(GET_TUD_SUBMISSION_DATES);

const DOWNLOAD_DAILY_TUD_DATA :'DOWNLOAD_DAILY_TUD_DATA' = 'DOWNLOAD_DAILY_TUD_DATA';
const downloadDailyTudData :RequestSequence = newRequestSequence(DOWNLOAD_DAILY_TUD_DATA);

const DOWNLOAD_ALL_TUD_DATA :'DOWNLOAD_ALL_TUD_DATA' = 'DOWNLOAD_ALL_TUD_DATA';
const downloadAllTudData :RequestSequence = newRequestSequence(DOWNLOAD_ALL_TUD_DATA);

export {
  DOWNLOAD_ALL_TUD_DATA,
  DOWNLOAD_DAILY_TUD_DATA,
  GET_SUBMISSIONS_BY_DATE,
  GET_TUD_SUBMISSION_DATES,
  downloadAllTudData,
  downloadDailyTudData,
  getSubmissionsByDate,
  getTudSubmissionDates,
};
