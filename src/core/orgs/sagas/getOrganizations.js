/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import * as OrganizationApi from '../../api/organization';
import { GET_ORGANIZATIONS, getOrganizations } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('OrgsSagas');

function* getOrganizationsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getOrganizations.request(id, value));
    const response = yield call(OrganizationApi.getOrganizations);
    workerResponse = { data: response };
    yield put(getOrganizations.success(id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getOrganizations.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getOrganizations.finally(id));
  }

  return workerResponse;
}

function* getOrganizationsWatcher() :Saga<*> {

  yield takeEvery(GET_ORGANIZATIONS, getOrganizationsWorker);
}

export {
  getOrganizationsWorker,
  getOrganizationsWatcher,
};
