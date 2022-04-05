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
import type { SequenceAction } from 'redux-reqseq';

import selectOrganizations from '../selectors/selectOrganizations';
import * as AppModules from '../../../utils/constants/AppModules';
import { selectESIDByCollection, selectEntityTypeId } from '../../../core/edm/EDMUtils';
import { STUDIES } from '../../../core/edm/constants/EntityTemplateNames';
import { ENTITY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';
import { COUNT_ALL_STUDIES, countAllStudies } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { countEntitiesInSets } = SearchApiActions;
const { countEntitiesInSetsWorker } = SearchApiSagas;

const LOG = new Logger('DashboardSagas');

function* countAllStudiesWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {

    const allOrganizations :Map = yield select(selectOrganizations());
    const allOrganizationIds = allOrganizations.keySeq().toArray();
    const entitySetIds = yield all(allOrganizationIds.map(
      (orgId) => select(selectESIDByCollection(STUDIES, AppModules.CHRONICLE_CORE, orgId))
    ));

    const entityTypeId = yield select(selectEntityTypeId(ENTITY_TYPE_FQNS.STUDY_FQN));
    const studyCountResponse = yield call(countEntitiesInSetsWorker, countEntitiesInSets({
      entityTypeId,
      entitySetIds,
    }));

    workerResponse.data = studyCountResponse.data;

    yield put(countAllStudies.success(action.id, workerResponse.data));
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
