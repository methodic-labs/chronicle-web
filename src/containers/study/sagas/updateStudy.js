// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { ID, STUDY } from '../../../common/constants';
import { UPDATE_STUDY, updateStudy } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* updateStudyWorker(action :SequenceAction) :Saga<*> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(updateStudy.request(id, value));
    const studyId = value[ID];
    let study = value[STUDY];

    study = yield call(StudyApi.updateStudy, study, studyId);
    yield put(updateStudy.success(id, study));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(updateStudy.failure(id, toSagaError(error)));
  }
  finally {
    yield put(updateStudy.finally(id));
  }

  return workerResponse;
}

function* updateStudyWatcher() :Saga<*> {

  yield takeEvery(UPDATE_STUDY, updateStudyWorker);
}

export {
  updateStudyWorker,
  updateStudyWatcher,
};
