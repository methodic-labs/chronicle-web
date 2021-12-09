// @flow

import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import selectOrganizations from '../selectors/selectOrganizations';
import * as AppModules from '../../../utils/constants/AppModules';
import { selectESIDByCollection, selectEntityTypeId } from '../../../core/edm/EDMUtils';
import { PARTICIPANTS } from '../../../core/edm/constants/EntityTemplateNames';
import { ENTITY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';
import { COUNT_ALL_PARTICIPANTS, countAllParticipants } from '../actions';

const { countEntitiesInSets } = SearchApiActions;
const { countEntitiesInSetsWorker } = SearchApiSagas;

const LOG = new Logger('DashboardSagas');

function* countAllParticipantsWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {

    const allOrganizations :Map = yield select(selectOrganizations());
    const allOrganizationIds = allOrganizations.keySeq().toArray();
    const entitySetIds = yield all(allOrganizationIds.map(
      (orgId) => select(selectESIDByCollection(PARTICIPANTS, AppModules.CHRONICLE_CORE, orgId))
    ));

    const entityTypeId = yield select(selectEntityTypeId(ENTITY_TYPE_FQNS.PARTICIPANTS_FQN));
    const participantsCountResponse = yield call(countEntitiesInSetsWorker, countEntitiesInSets({
      entityTypeId,
      entitySetIds,
    }));

    workerResponse.data = participantsCountResponse.data;

    yield put(countAllParticipants.success(action.id, workerResponse.data));
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
