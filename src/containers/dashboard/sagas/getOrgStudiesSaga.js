// @flow

import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { fromJS } from 'immutable';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as AppModules from '../../../utils/constants/AppModules';
import { selectESIDByCollection } from '../../../core/edm/EDMUtils';
import { STUDIES } from '../../../core/edm/constants/EntityTemplateNames';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { GET_ORG_STUDIES, getOrgStudies } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;

const { isValidUUID } = ValidationUtils;
const LOG = new Logger('DashboardSagas');

function* getOrgStudiesWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    const orgId = action.value;
    if (!isValidUUID(orgId)) throw ERR_ACTION_VALUE_TYPE;

    const studiesEntitySetId = yield select(selectESIDByCollection(STUDIES, AppModules.CHRONICLE_CORE, orgId));

    yield put(getOrgStudies.request(action.id));

    const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId: studiesEntitySetId }));
    if (response.error) {
      throw response.error;
    }

    const studies = fromJS(response.data);

    workerResponse.data = studies;
    yield put(getOrgStudies.success(action.id, workerResponse.data));
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
