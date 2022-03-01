/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { GET_ALL_STUDIES, getAllStudies } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('StudySagas');

function* getAllStudiesWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(getAllStudies.request(id, value));
    const response = yield call(StudyApi.getAllStudies);
    const studies = Map().withMutations((mutableMap) => {
      response.forEach((study) => mutableMap.set(study.id, study));
    });
    workerResponse = { data: studies };
    yield put(getAllStudies.success(id, studies));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(getAllStudies.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getAllStudies.finally(id));
  }

  return workerResponse;
}

function* getAllStudiesWatcher() :Saga<*> {

  yield takeEvery(GET_ALL_STUDIES, getAllStudiesWorker);
}

export {
  getAllStudiesWorker,
  getAllStudiesWatcher,
};
