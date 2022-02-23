/*
 * @flow
 */

import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { getStudyWorker } from './getStudy';
import { getStudyParticipantsWorker } from './getStudyParticipants';

import { IS_OWNER, PermissionTypes, STUDY_ID } from '../../../common/constants';
import { getAuthorizations } from '../../../core/permissions/actions';
import { getAuthorizationsWorker } from '../../../core/permissions/sagas';
import {
  INITIALIZE_STUDY,
  getStudy,
  getStudyParticipants,
  initializeStudy,
} from '../actions';
import type { AuthorizationObject, WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* initializeStudyWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(initializeStudy.request(action.id, action.value));

    const studyId :UUID = action.value;

    const getStudyCall = call(getStudyWorker, getStudy(studyId));
    const getStudyParticipantsCall = call(getStudyParticipantsWorker, getStudyParticipants(studyId));
    const getAuthorizationsCall = call(getAuthorizationsWorker, getAuthorizations([{
      aclKey: [studyId],
      permissions: [PermissionTypes.OWNER]
    }]));

    const [
      getStudyResponse,
      getStudyParticipantsResponse,
      getAuthorizationsResponse,
    ] :Array<WorkerResponse> = yield all([
      getStudyCall,
      getStudyParticipantsCall,
      getAuthorizationsCall,
    ]);

    if (getStudyResponse.error) throw getStudyResponse.error;
    if (getStudyParticipantsResponse.error) throw getStudyParticipantsResponse.error;
    if (getAuthorizationsResponse.error) throw getAuthorizationsResponse.error;

    const authorizations :AuthorizationObject[] = getAuthorizationsResponse.data;
    const isOwner = authorizations[0].permissions[PermissionTypes.OWNER] === true;

    yield put(initializeStudy.success(action.id, {
      [IS_OWNER]: isOwner,
      [STUDY_ID]: studyId,
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(initializeStudy.failure(action.id, toSagaError(error)));
  }
  finally {
    yield put(initializeStudy.finally(action.id));
  }
}

function* initializeStudyWatcher() :Saga<*> {

  yield takeEvery(INITIALIZE_STUDY, initializeStudyWorker);
}

export {
  initializeStudyWatcher,
  initializeStudyWorker,
};
