/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { Logger, toSagaError } from '../../../common/utils';
import { GET_STUDY_PERMISSIONS, getStudyPermissions } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* getStudyPermissionsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getStudyPermissions.request(id, value));
    const response = yield call(StudyApi.getStudyPermissions, value);
    workerResponse = { data: response };
    yield put(getStudyPermissions.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(getStudyPermissions.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getStudyPermissions.finally(id));
  }

  return workerResponse;
}

function* getStudyPermissionsWatcher() :Saga<*> {

  yield takeEvery(GET_STUDY_PERMISSIONS, getStudyPermissionsWorker);
}

export {
  getStudyPermissionsWatcher,
  getStudyPermissionsWorker,
};
