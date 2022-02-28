/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { ERR_INVALID_PARTICIPANT, PARTICIPANT_ID, STUDY_ID } from '../../../common/constants';
import { REGISTER_PARTICIPANT, verifyParticipant } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* verifyParticipantWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(verifyParticipant.request(id, value));
    const isValid = yield call(StudyApi.verifyParticipant, action.value[STUDY_ID], action.value[PARTICIPANT_ID]);
    if (!isValid) throw Error(ERR_INVALID_PARTICIPANT);
    workerResponse = { data: isValid };
    yield put(verifyParticipant.success(id, isValid));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(verifyParticipant.failure(id, toSagaError(error)));
  }
  finally {
    yield put(verifyParticipant.finally(id));
  }

  return workerResponse;
}

function* verifyParticipantWatcher() :Saga<*> {

  yield takeEvery(REGISTER_PARTICIPANT, verifyParticipantWorker);
}

export {
  verifyParticipantWorker,
  verifyParticipantWatcher,
};
