// @flow

import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map } from 'immutable';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { getOrgStudiesTableDataWorker } from './getOrgStudiesTableDataSaga';

import selectOrganizations from '../selectors/selectOrganizations';
import { Logger } from '../../../common/utils';
import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData, getOrgStudiesTableData } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DashboardSagas');

function* getAllStudiesTableDataWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(getAllStudiesTableData.request(action.id));

    const allOrganizations :Map = yield select(selectOrganizations());
    const allOrganizationIds = allOrganizations.keySeq().toArray();

    const orgStudiesTableData = allOrganizationIds
      .map((id) => call(getOrgStudiesTableDataWorker, getOrgStudiesTableData(id)));
    const allTableDataByOrg = yield all(orgStudiesTableData);

    const tableData = List().withMutations((mutable) => {
      allTableDataByOrg.forEach((tableDataByOrg) => {
        if (tableDataByOrg.data) {
          mutable.merge(tableDataByOrg.data);
        }
      });
    });

    workerResponse.data = tableData;
    yield put(getAllStudiesTableData.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(getAllStudiesTableData.failure(action.id, error));
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
