/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { Logger, toSagaError } from '../../../common/utils';
import { GET_STUDY_LIMITS, getStudyLimits } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* getStudyLimitsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getStudyLimits.request(id, value));
    const response = yield call(StudyApi.getStudyLimits, value);
    workerResponse = { data: response };
    yield put(getStudyLimits.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(getStudyLimits.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getStudyLimits.finally(id));
  }

  return workerResponse;
}

function* getStudyLimitsWatcher() :Saga<*> {

  yield takeEvery(GET_STUDY_LIMITS, getStudyLimitsWorker);
}

export {
  getStudyLimitsWorker,
  getStudyLimitsWatcher,
};
