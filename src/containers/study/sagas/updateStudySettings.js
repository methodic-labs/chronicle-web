// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { Logger, toSagaError } from '../../../common/utils';
import { UPDATE_STUDY_SETTINGS, updateStudySettings } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* updateStudySettingsWorker(action :SequenceAction) :Saga<*> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(updateStudySettings.request(id, value));
    const { studyId, settingType, settings } = value;

    yield call(StudyApi.updateStudySettings, studyId, settingType, settings);
    yield put(updateStudySettings.success(id, { studyId, settingType, settings }));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(updateStudySettings.failure(id, toSagaError(error)));
  }
  finally {
    yield put(updateStudySettings.finally(id));
  }

  return workerResponse;
}

function* updateStudySettingsWatcher() :Saga<*> {

  yield takeEvery(UPDATE_STUDY_SETTINGS, updateStudySettingsWorker);
}

export {
  updateStudySettingsWorker,
  updateStudySettingsWatcher,
};
