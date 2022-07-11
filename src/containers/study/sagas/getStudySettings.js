/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { Logger, toSagaError } from '../../../common/utils';
import { GET_STUDY_SETTINGS, getStudySettings } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* getStudySettingsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getStudySettings.request(id, value));
    const response = yield call(StudyApi.getStudySettings, value);
    workerResponse = { data: response };
    yield put(getStudySettings.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(getStudySettings.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getStudySettings.finally(id));
  }

  return workerResponse;
}

function* getStudySettingsWatcher() :Saga<*> {

  yield takeEvery(GET_STUDY_SETTINGS, getStudySettingsWorker);
}

export {
  getStudySettingsWorker,
  getStudySettingsWatcher,
};
