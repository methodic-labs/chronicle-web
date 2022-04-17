// @flow

import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { fromJS } from 'immutable';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { countAllParticipantsWorker } from './countAllParticipantsSaga';
import { countAllStudiesWorker } from './countAllStudiesSaga';

import selectOrganizationCount from '../selectors/selectOrganizationCount';
import {
  GET_SUMMARY_STATS,
  countAllParticipants,
  countAllStudies,
  getSummaryStats
} from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DashboardSagas');

function* getSummaryStatsWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(getSummaryStats.request(action.id));

    const [organizations, studies, participants] = yield all([
      select(selectOrganizationCount()),
      call(countAllStudiesWorker, countAllStudies()),
      call(countAllParticipantsWorker, countAllParticipants()),
    ]);

    workerResponse.data = fromJS({
      organizations,
      studies: studies.data,
      participants: participants.data,
    });
    yield put(getSummaryStats.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(getSummaryStats.failure(action.id, error));
  }
  finally {
    yield put(getSummaryStats.finally(action.id));
  }

  return workerResponse;
}

function* getSummaryStatsWatcher() :Saga<void> {
  yield takeLatest(GET_SUMMARY_STATS, getSummaryStatsWorker);
}

export {
  getSummaryStatsWatcher,
  getSummaryStatsWorker,
};
