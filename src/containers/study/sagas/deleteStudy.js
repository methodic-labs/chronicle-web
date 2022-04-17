/*
 * @flow
 */

import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { STUDY_ID } from '../../../common/constants';
import { DELETE_STUDY, deleteStudy } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* deleteStudyWorker(action :SequenceAction) :Saga<*> {

  const { id, value } = action;

  try {
    const studyId = value[STUDY_ID];
    yield put(deleteStudy.request(id));
    yield call(StudyApi.deleteStudy, studyId);
    yield put(deleteStudy.success(id, studyId));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(deleteStudy.failure(id, toSagaError(error)));
  }
  finally {
    yield put(deleteStudy.finally(id));
  }

}

function* deleteStudyWatcher() :Saga<*> {

  yield takeEvery(DELETE_STUDY, deleteStudyWorker);
}

export {
  deleteStudyWorker,
  deleteStudyWatcher,
};
