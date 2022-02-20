/*
 * @flow
 */

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { ORGANIZATIONS } from '../../../common/constants';
import { getOrganizations } from '../../../core/orgs/actions';
import { getOrganizationsWorker } from '../../../core/orgs/sagas';
import { selectOrganizations } from '../../../core/redux/selectors';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('AppSagas');

function* initializeApplicationWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(initializeApplication.request(action.id));

    yield all([
      call(getOrganizationsWorker, getOrganizations())
    ]);

    const organizations = yield select(selectOrganizations());

    yield put(initializeApplication.success(action.id, {
      [ORGANIZATIONS]: organizations
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(initializeApplication.failure(action.id, toSagaError(error)));
  }
  finally {
    yield put(initializeApplication.finally(action.id));
  }
}

function* initializeApplicationWatcher() :Saga<*> {

  yield takeEvery(INITIALIZE_APPLICATION, initializeApplicationWorker);
}

export {
  initializeApplicationWatcher,
  initializeApplicationWorker,
};
