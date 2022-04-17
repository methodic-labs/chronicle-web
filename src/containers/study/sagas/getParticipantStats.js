/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { GET_PARTICIPANT_STATS, getParticipantStats } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* getParticipantStatsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getParticipantStats.request(id, value));
    const response = yield call(StudyApi.getParticipantStats, value);
    workerResponse = { data: response };
    yield put(getParticipantStats.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(getParticipantStats.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getParticipantStats.finally(id));
  }

  return workerResponse;
}

function* getParticipantStatsWatcher() :Saga<*> {

  yield takeEvery(GET_PARTICIPANT_STATS, getParticipantStatsWorker);
}

export {
  getParticipantStatsWorker,
  getParticipantStatsWatcher,
};
