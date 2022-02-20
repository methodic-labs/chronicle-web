/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { GET_ORG_STUDIES, getOrgStudies } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('OrgsSagas');

function* getOrgStudiesWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getOrgStudies.request(id, value));
    const response = yield call(StudyApi.getOrgStudies, value);
    const studies = Map().withMutations((mutableMap) => {
      response.forEach((study) => mutableMap.set(study.id, study));
    });
    workerResponse = { data: studies };
    yield put(getOrgStudies.success(id, studies));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getOrgStudies.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getOrgStudies.finally(id));
  }

  return workerResponse;
}

function* getOrgStudiesWatcher() :Saga<*> {

  yield takeEvery(GET_ORG_STUDIES, getOrgStudiesWorker);
}

export {
  getOrgStudiesWorker,
  getOrgStudiesWatcher,
};
