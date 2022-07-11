// @flow

import { put, takeLatest } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { Logger } from '../../../common/utils';
import { GET_ORG_STUDIES, getOrgStudies } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DashboardSagas');

function* getOrgStudiesWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(getOrgStudies.request(action.id));
    throw Error('not implemented');
    // const orgId = action.value;
    // if (!isValidUUID(orgId)) throw ERR_ACTION_VALUE_TYPE;
    //
    // const studiesEntitySetId = yield select(selectESIDByCollection(STUDIES, AppModules.CHRONICLE_CORE, orgId));
    //
    // yield put(getOrgStudies.request(action.id));
    //
    // const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId: studiesEntitySetId }));
    // if (response.error) {
    //   throw response.error;
    // }
    //
    // const studies = fromJS(response.data);
    // yield put(getOrgStudies.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(getOrgStudies.failure(action.id, error));
  }
  finally {
    yield put(getOrgStudies.finally(action.id));
  }

  return workerResponse;
}

function* getOrgStudiesWatcher() :Saga<void> {
  yield takeLatest(GET_ORG_STUDIES, getOrgStudiesWorker);
}

export {
  getOrgStudiesWatcher,
  getOrgStudiesWorker,
};
