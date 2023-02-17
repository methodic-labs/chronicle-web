/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as AuthorizationsApi from '../../api/authorizations';
import { Logger, toSagaError } from '../../../common/utils';
import { GET_AUTHORIZATIONS, getAuthorizations } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('PermissionsSagas');

function* getAuthorizationsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getAuthorizations.request(id, value));
    const response = yield call(AuthorizationsApi.getAuthorizations, value);
    workerResponse = { data: response };
    yield put(getAuthorizations.success(id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getAuthorizations.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getAuthorizations.finally(id));
  }

  return workerResponse;
}

function* getAuthorizationsWatcher() :Saga<*> {

  yield takeEvery(GET_AUTHORIZATIONS, getAuthorizationsWorker);
}

export {
  getAuthorizationsWatcher,
  getAuthorizationsWorker,
};
