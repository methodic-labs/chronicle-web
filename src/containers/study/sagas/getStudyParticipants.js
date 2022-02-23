/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from '../../../common/types';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { GET_STUDY_PARTICIPANTS, getStudyParticipants } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('OrgsSagas');

function* getStudyParticipantsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getStudyParticipants.request(id, value));
    const response = yield call(StudyApi.getStudyParticipants, value);
    workerResponse = { data: response };
    yield put(getStudyParticipants.success(id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getStudyParticipants.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getStudyParticipants.finally(id));
  }

  return workerResponse;
}

function* getStudyParticipantsWatcher() :Saga<*> {

  yield takeEvery(GET_STUDY_PARTICIPANTS, getStudyParticipantsWorker);
}

export {
  getStudyParticipantsWorker,
  getStudyParticipantsWatcher,
};
