/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { fromJS } from 'immutable';
import { AxiosUtils, DateTimeUtils, Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as TimeUseDiaryApi from '../../../core/api/timeusediary';
import { END_DATE, START_DATE, STUDY_ID } from '../../../common/constants';
import { GET_TUD_SUBMISSIONS_BY_DATE_RANGE, getTimeUseDiarySubmissionsByDateRange } from '../actions';

const { toSagaError } = AxiosUtils;
const { formatAsDate } = DateTimeUtils;

const LOG = new Logger('TimeUseDiarySagas');

function* getTimeUseDiarySubmissionsByDateRangeWorker(action :SequenceAction) :Saga<*> {

  const { id, type, value } = action;

  try {
    yield put(getTimeUseDiarySubmissionsByDateRange.request(id));
    const response = yield call(
      TimeUseDiaryApi.getTimeUseDiarySubmissionsByDateRange,
      value[STUDY_ID],
      DateTime.fromISO(value[START_DATE]).startOf('day').toISO(),
      DateTime.fromISO(value[END_DATE]).endOf('day').toISO(),
    );
    const submissions = fromJS(response)
      .mapKeys((date) => DateTime.fromISO(date))
      .sort()
      .mapKeys((date) => formatAsDate(date));
    yield put(getTimeUseDiarySubmissionsByDateRange.success(id, submissions));
  }
  catch (error) {
    LOG.error(type, error);
    yield put(getTimeUseDiarySubmissionsByDateRange.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getTimeUseDiarySubmissionsByDateRange.finally(id));
  }
}

function* getTimeUseDiarySubmissionsByDateRangeWatcher() :Saga<*> {

  yield takeEvery(GET_TUD_SUBMISSIONS_BY_DATE_RANGE, getTimeUseDiarySubmissionsByDateRangeWorker);
}

export {
  getTimeUseDiarySubmissionsByDateRangeWatcher,
  getTimeUseDiarySubmissionsByDateRangeWorker,
};
