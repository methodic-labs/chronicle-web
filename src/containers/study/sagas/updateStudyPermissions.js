/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { STUDY_ID, UPDATE } from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { UPDATE_STUDY_PERMISSIONS, updateStudyPermissions } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* updateStudyPermissionsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(updateStudyPermissions.request(id, value));
    // The server replies with the study's access as it stands after the update, so the reducer can store the response
    // directly instead of guessing at the new state or re-fetching.
    const response = yield call(StudyApi.updateStudyPermissions, value[STUDY_ID], value[UPDATE]);
    workerResponse = { data: response };
    yield put(updateStudyPermissions.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(updateStudyPermissions.failure(id, toSagaError(error)));
  }
  finally {
    yield put(updateStudyPermissions.finally(id));
  }

  return workerResponse;
}

function* updateStudyPermissionsWatcher() :Saga<*> {

  yield takeEvery(UPDATE_STUDY_PERMISSIONS, updateStudyPermissionsWorker);
}

export {
  updateStudyPermissionsWatcher,
  updateStudyPermissionsWorker,
};
