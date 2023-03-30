/*
 * @flow
 */

import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { getParticipantStatsWorker } from './getParticipantStats';
import { getStudyWorker } from './getStudy';
import { getStudyLimitsWorker } from './getStudyLimits';
import { getStudyParticipantsWorker } from './getStudyParticipants';

import {
  IS_OWNER,
  PermissionTypes,
  STUDY,
  STUDY_ID
} from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { getAuthorizations } from '../../../core/permissions/actions';
import { getAuthorizationsWorker } from '../../../core/permissions/sagas';
import {
  INITIALIZE_STUDY,
  getParticipantStats,
  getStudy,
  getStudyLimits,
  getStudyParticipants,
  initializeStudy,
} from '../actions';
import type { AuthorizationObject, UUID, WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* initializeStudyWorker(action :SequenceAction) :Saga<*> {

  const { id, type, value } = action;

  try {
    yield put(initializeStudy.request(id, value));

    const studyId :UUID = value;

    const getStudyCall = call(getStudyWorker, getStudy(studyId));
    const getStudyLimitsCall = call(getStudyLimitsWorker, getStudyLimits(studyId));
    const getStudyParticipantsCall = call(getStudyParticipantsWorker, getStudyParticipants(studyId));
    const getParticipantStatsCall = call(getParticipantStatsWorker, getParticipantStats(studyId));
    const getAuthorizationsCall = call(getAuthorizationsWorker, getAuthorizations([{
      aclKey: [studyId],
      permissions: [PermissionTypes.OWNER]
    }]));

    const [
      getStudyResponse,
      getStudyLimitsResponse,
      getStudyParticipantsResponse,
      getParticipantStatsResponse,
      getAuthorizationsResponse,
    ] :Array<WorkerResponse> = yield all([
      getStudyCall,
      getStudyLimitsCall,
      getStudyParticipantsCall,
      getParticipantStatsCall,
      getAuthorizationsCall,
    ]);

    if (getStudyResponse.error) throw getStudyResponse.error;
    if (getStudyLimitsResponse.error) throw getStudyLimitsResponse.error;
    if (getStudyParticipantsResponse.error) throw getStudyParticipantsResponse.error;
    if (getParticipantStatsResponse.error) throw getParticipantStatsResponse.error;
    if (getAuthorizationsResponse.error) throw getAuthorizationsResponse.error;

    const authorizations :AuthorizationObject[] = getAuthorizationsResponse.data;
    const isOwner = authorizations[0].permissions[PermissionTypes.OWNER] === true;

    yield put(initializeStudy.success(id, {
      [IS_OWNER]: isOwner,
      [STUDY_ID]: studyId,
      [STUDY]: getStudyResponse.data
    }));
  }
  catch (error) {
    LOG.error(type, error);
    yield put(initializeStudy.failure(id, toSagaError(error)));
  }
  finally {
    yield put(initializeStudy.finally(id));
  }
}

function* initializeStudyWatcher() :Saga<*> {

  yield takeEvery(INITIALIZE_STUDY, initializeStudyWorker);
}

export {
  initializeStudyWatcher,
  initializeStudyWorker,
};
