// @flow

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import {
  CANDIDATE_ID,
  PARTICIPANT_ID,
  PARTICIPATION_STATUS,
  STUDY_ID
} from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { CHANGE_ENROLLMENT_STATUS, changeEnrollmentStatus } from '../actions';

const LOG = new Logger('StudySagas');

function* changeEnrollmentStatusWorker(action :SequenceAction) :Saga<*> {

  const { id, type, value } = action;

  const studyId = value[STUDY_ID];
  const participantId = value[PARTICIPANT_ID];
  const participationStatus = value[PARTICIPATION_STATUS];

  // candidate
  try {
    yield put(changeEnrollmentStatus.request(id, value));
    yield call(StudyApi.changeEnrollmentStatus, studyId, participantId, participationStatus);

    yield put(changeEnrollmentStatus.success(id, {
      [CANDIDATE_ID]: value[CANDIDATE_ID],
      [STUDY_ID]: studyId,
      [PARTICIPATION_STATUS]: participationStatus
    }));
  }
  catch (error) {
    LOG.error(type, error);
    yield put(changeEnrollmentStatus.failure(id, toSagaError(error)));
  }
  finally {
    yield put(changeEnrollmentStatus.finally(id));
  }

}

function* changeEnrollmentStatusWatcher() :Saga<*> {
  yield takeEvery(CHANGE_ENROLLMENT_STATUS, changeEnrollmentStatusWorker);
}

export {
  changeEnrollmentStatusWatcher,
  changeEnrollmentStatusWorker,
};
