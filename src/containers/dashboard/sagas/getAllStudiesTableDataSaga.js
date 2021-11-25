// @flow

import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData } from '../actions';
import { PARTICIPANTS, PARTICIPATED_IN, STUDIES } from '../../../core/edm/constants/EntityTemplateNames';


const LOG = new Logger('DashboardSagas');

function* getAllStudiesTableDataWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(getAllStudiesTableData.request(action.id));
    const 
    workerResponse.data = {};
    yield put(getAllStudiesTableData.success(action.id));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(getAllStudiesTableData.failure(action.id));
  }
  finally {
    yield put(getAllStudiesTableData.finally(action.id));
  }

  return workerResponse;
}

function* getAllStudiesTableDataWatcher() :Saga<void> {
  yield takeLatest(GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableDataWorker);
}

export {
  getAllStudiesTableDataWatcher,
  getAllStudiesTableDataWorker,
};
