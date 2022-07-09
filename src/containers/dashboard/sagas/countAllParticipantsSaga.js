// @flow

import { put, takeLatest } from '@redux-saga/core/effects';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { COUNT_ALL_PARTICIPANTS, countAllParticipants } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DashboardSagas');

function* countAllParticipantsWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(countAllParticipants.request(action.id));
    throw Error('not implemented');
    // const allOrganizations :Map = yield select(selectOrganizations());
    // const allOrganizationIds = allOrganizations.keySeq().toArray();
    // const entitySetIds = yield all(allOrganizationIds.map(
    //   (orgId) => select(selectESIDByCollection(PARTICIPANTS, AppModules.CHRONICLE_CORE, orgId))
    // ));
    //
    // const entityTypeId = yield select(selectEntityTypeId(ENTITY_TYPE_FQNS.PARTICIPANTS_FQN));
    // const participantsCountResponse = yield call(countEntitiesInSetsWorker, countEntitiesInSets({
    //   entityTypeId,
    //   entitySetIds,
    // }));
    //
    // workerResponse.data = participantsCountResponse.data;
    // yield put(countAllParticipants.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(countAllParticipants.failure(action.id, error));
  }
  finally {
    yield put(countAllParticipants.finally(action.id));
  }

  return workerResponse;
}

function* countAllParticipantsWatcher() :Saga<void> {
  yield takeLatest(COUNT_ALL_PARTICIPANTS, countAllParticipantsWorker);
}

export {
  countAllParticipantsWatcher,
  countAllParticipantsWorker,
};
