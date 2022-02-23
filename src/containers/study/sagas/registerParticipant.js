/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import {
  CANDIDATE,
  ID,
  PARTICIPANT_ID,
  PARTICIPATION_STATUS,
  ParticipationStatuses,
  STUDY_ID,
} from '../../../common/constants';
import { REGISTER_PARTICIPANT, registerParticipant } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* registerParticipantWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(registerParticipant.request(id, value));
    const participant = {
      [CANDIDATE]: {},
      [PARTICIPANT_ID]: action.value[PARTICIPANT_ID],
      [PARTICIPATION_STATUS]: ParticipationStatuses.UNKNOWN,
    };
    const candidateId = yield call(StudyApi.registerParticipant, action.value[STUDY_ID], participant);
    participant[CANDIDATE][ID] = candidateId;
    workerResponse = { data: participant };
    yield put(registerParticipant.success(id, participant));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(registerParticipant.failure(id, toSagaError(error)));
  }
  finally {
    yield put(registerParticipant.finally(id));
  }

  return workerResponse;
}

function* registerParticipantWatcher() :Saga<*> {

  yield takeEvery(REGISTER_PARTICIPANT, registerParticipantWorker);
}

export {
  registerParticipantWorker,
  registerParticipantWatcher,
};
