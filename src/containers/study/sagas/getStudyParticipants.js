/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { CANDIDATE, ID } from '../../../common/constants';
import { GET_STUDY_PARTICIPANTS, getStudyParticipants } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* getStudyParticipantsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getStudyParticipants.request(id, value));
    const response = yield call(StudyApi.getStudyParticipants, value);
    const participants = Map().withMutations((mutableMap) => {
      response.forEach((participant) => mutableMap.set(participant[CANDIDATE][ID], participant));
    });
    workerResponse = { data: participants };
    yield put(getStudyParticipants.success(id, participants));
  }
  catch (error) {
    LOG.error(type, error);
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
