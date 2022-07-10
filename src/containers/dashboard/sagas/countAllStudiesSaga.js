// @flow

import { put, takeLatest } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { Logger } from '../../../common/utils';
import { COUNT_ALL_STUDIES, countAllStudies } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DashboardSagas');

function* countAllStudiesWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(countAllStudies.request(action.id));
    throw Error('not implemented');
    // const allOrganizations :Map = yield select(selectOrganizations());
    // const allOrganizationIds = allOrganizations.keySeq().toArray();
    // const entitySetIds = yield all(allOrganizationIds.map(
    //   (orgId) => select(selectESIDByCollection(STUDIES, AppModules.CHRONICLE_CORE, orgId))
    // ));
    //
    // const entityTypeId = yield select(selectEntityTypeId(ENTITY_TYPE_FQNS.STUDY_FQN));
    // const studyCountResponse = yield call(countEntitiesInSetsWorker, countEntitiesInSets({
    //   entityTypeId,
    //   entitySetIds,
    // }));
    //
    // workerResponse.data = studyCountResponse.data;
    // yield put(countAllStudies.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(countAllStudies.failure(action.id, error));
  }
  finally {
    yield put(countAllStudies.finally(action.id));
  }

  return workerResponse;
}

function* countAllStudiesWatcher() :Saga<void> {
  yield takeLatest(COUNT_ALL_STUDIES, countAllStudiesWorker);
}

export {
  countAllStudiesWatcher,
  countAllStudiesWorker,
};
