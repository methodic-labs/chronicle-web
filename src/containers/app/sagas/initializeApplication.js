/*
 * @flow
 */

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { SELECTED_ORG_ID } from '../../../common/constants';
import { getOrgIdFromStorage } from '../../../common/utils';
import { getOrganizations } from '../../../core/orgs/actions';
import { getOrganizationsWorker } from '../../../core/orgs/sagas';
import { selectOrganizations } from '../../../core/redux/selectors';
import { getOrgStudies } from '../../studies/actions';
import { getOrgStudiesWorker } from '../../studies/sagas';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('AppSagas');

function* initializeApplicationWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(initializeApplication.request(action.id));

    yield call(getOrganizationsWorker, getOrganizations());
    const organizations = yield select(selectOrganizations());
    let selectedOrgId = organizations.first()?.id;
    const storedOrgId = getOrgIdFromStorage();
    if (storedOrgId && organizations.has(storedOrgId)) {
      selectedOrgId = storedOrgId;
    }

    if (selectedOrgId) {
      yield call(getOrgStudiesWorker, getOrgStudies(selectedOrgId));
    }

    yield put(initializeApplication.success(action.id, {
      [SELECTED_ORG_ID]: selectedOrgId,
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
