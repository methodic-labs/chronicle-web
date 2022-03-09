/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as TimeUseDiaryApi from '../../../core/api/timeusediary';
import {
  FAMILY_ID,
  FORM_DATA,
  LANGUAGE,
  PARTICIPANT_ID,
  STUDY_ID,
  TRANSLATION_DATA,
  WAVE_ID,
} from '../../../common/constants';
import { SUBMIT_TIME_USE_DIARY, submitTimeUseDiary } from '../actions';
import { createSubmitRequestBody } from '../utils';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('TimeUseDiarySagas');

function* submitTimeUseDiaryWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(submitTimeUseDiary.request(action.id));

    const data = createSubmitRequestBody(
      action.value[FORM_DATA],
      action.value[FAMILY_ID],
      action.value[WAVE_ID],
      action.value[LANGUAGE],
      action.value[TRANSLATION_DATA],
    );

    yield call(
      TimeUseDiaryApi.submitTimeUseDiary,
      action.value[STUDY_ID],
      action.value[PARTICIPANT_ID],
      data,
    );

    yield put(submitTimeUseDiary.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitTimeUseDiary.failure(action.id, toSagaError(error)));
  }
  finally {
    yield put(submitTimeUseDiary.finally(action.id));
  }
}

function* submitTimeUseDiaryWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_TIME_USE_DIARY, submitTimeUseDiaryWorker);
}

export {
  submitTimeUseDiaryWatcher,
  submitTimeUseDiaryWorker,
};
