/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { getAllStudies } from '../../studies/actions';
import { getAllStudiesWorker } from '../../studies/sagas';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('AppSagas');

function* initializeApplicationWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(initializeApplication.request(action.id));

    // NOTE - leaving this here in case we want to bring back org selection
    // yield call(getOrganizationsWorker, getOrganizations());
    // const organizations = yield select(selectOrganizations());
    // let selectedOrgId = organizations.first()?.id;
    // const storedOrgId = getOrgIdFromStorage();
    // if (storedOrgId && organizations.has(storedOrgId)) {
    //   selectedOrgId = storedOrgId;
    // }
    // if (selectedOrgId) {
    //   yield call(getOrgStudiesWorker, getOrgStudies(selectedOrgId));
    // }

    const response = yield call(getAllStudiesWorker, getAllStudies());
    if (response.error) throw response.error;

    yield put(initializeApplication.success(action.id));
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
