/*
 * @flow
 */

import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { initializeApplicationWorker } from './initializeApplication';

import { Logger, storeOrganizationId, toSagaError } from '../../../common/utils';
import { goToRoot } from '../../../core/router/RoutingActions';
import { SWITCH_ORGANIZATION, initializeApplication, switchOrganization } from '../actions';

const LOG = new Logger('AppSagas');

function* switchOrganizationWorker(action :SequenceAction) :Saga<*> {
  try {
    yield put(switchOrganization.request(action.id));
    storeOrganizationId(action.value);
    yield put(goToRoot());
    yield call(initializeApplicationWorker, initializeApplication());
    yield put(switchOrganization.success(action.id, action.value));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(switchOrganization.failure(action.id, toSagaError(error)));
  }
  finally {
    yield put(switchOrganization.finally(action.id));
  }
}

function* switchOrganizationWatcher() :Saga<*> {
  yield takeEvery(SWITCH_ORGANIZATION, switchOrganizationWorker);
}

export {
  switchOrganizationWatcher,
  switchOrganizationWorker,
};
