/*
 * @flow
 */

import {
  call, delay, put, takeLatest
} from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import { EMAIL, STUDY_ID } from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { SEARCH_STUDY_USERS, searchStudyUsers } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

/*
 * The search is driven by typing, and every keystroke reaches Auth0. takeLatest plus a short debounce means an admin
 * typing an address issues one request for what they finished typing rather than one per character.
 */
const SEARCH_DEBOUNCE_MS = 300;

function* searchStudyUsersWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(searchStudyUsers.request(id, value));
    yield delay(SEARCH_DEBOUNCE_MS);
    const response = yield call(StudyApi.searchStudyUsers, value[STUDY_ID], value[EMAIL]);
    workerResponse = { data: response };
    yield put(searchStudyUsers.success(id, response));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(searchStudyUsers.failure(id, toSagaError(error)));
  }
  finally {
    yield put(searchStudyUsers.finally(id));
  }

  return workerResponse;
}

function* searchStudyUsersWatcher() :Saga<*> {

  yield takeLatest(SEARCH_STUDY_USERS, searchStudyUsersWorker);
}

export {
  searchStudyUsersWatcher,
  searchStudyUsersWorker,
};
