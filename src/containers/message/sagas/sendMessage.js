// @flow

import {
  call,
  put,
  takeEvery
} from '@redux-saga/core/effects';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import * as ChronicleApi from '../../../utils/api/ChronicleApi';
import {
  SEND_MESSAGE,
  sendMessage,
} from '../actions';

const LOG = new Logger('MessageSagas');

function* sendMessageWorker(action :SequenceAction) :Saga<*> {
  let workerResponse :WorkerResponse;
  try {
    yield put(sendMessage.request(action.id));
    const { messageDetailsList, organizationId } = action.value;

    const response = yield call(ChronicleApi.sendMessage, organizationId, messageDetailsList);
    workerResponse = { data: response.data };

    yield put(sendMessage.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(sendMessage.failure(action.id));
  }
  finally {
    yield put(sendMessage.finally(action.id));
  }

  return workerResponse;
}

function* sendMessageWatcher() :Saga<*> {
  yield takeEvery(SEND_MESSAGE, sendMessageWorker);
}

export {
  sendMessageWatcher,
  sendMessageWorker
};
