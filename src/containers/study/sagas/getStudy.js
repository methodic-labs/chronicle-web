/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { GET_STUDY, getStudy } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* getStudyWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getStudy.request(id, value));
    const response = yield call(StudyApi.getStudy, value);
    workerResponse = { data: response };
    yield put(getStudy.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(getStudy.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getStudy.finally(id));
  }

  return workerResponse;
}

function* getStudyWatcher() :Saga<*> {

  yield takeEvery(GET_STUDY, getStudyWorker);
}

export {
  getStudyWorker,
  getStudyWatcher,
};
