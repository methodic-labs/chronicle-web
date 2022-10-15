/*
 * @flow
 */

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { CANDIDATE_IDS, STUDY_ID } from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { selectStudyParticipants } from '../../../core/redux/selectors';
import { DELETE_STUDY_PARTICIPANTS, deleteStudyParticipants } from '../actions';
import type { Participant, UUID, WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* deleteStudyParticipantsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(deleteStudyParticipants.request(id, value));
    const studyId :UUID = value[STUDY_ID];
    const candidateIds :UUID[] = value[CANDIDATE_IDS];
    const participants :Map<UUID, Participant> = yield select(selectStudyParticipants(studyId));
    const participantIds :string[] = participants
      .filter((p :Participant) => candidateIds.includes(p.candidate.id))
      .map((p :Participant) => p.participantId)
      .valueSeq()
      .toJS();
    const response = yield call(StudyApi.deleteStudyParticipants, studyId, participantIds);
    workerResponse = { data: response };
    yield put(deleteStudyParticipants.success(id));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(deleteStudyParticipants.failure(id, toSagaError(error)));
  }
  finally {
    yield put(deleteStudyParticipants.finally(id));
  }

  return workerResponse;
}

function* deleteStudyParticipantsWatcher() :Saga<*> {

  yield takeEvery(DELETE_STUDY_PARTICIPANTS, deleteStudyParticipantsWorker);
}

export {
  deleteStudyParticipantsWorker,
  deleteStudyParticipantsWatcher,
};
