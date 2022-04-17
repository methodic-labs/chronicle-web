/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as AppUsageSurveyApi from '../../../core/api/appusagesurvey';
import { SUBMIT_APP_USAGE_SURVEY, submitAppUsageSurvey } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('SurveySagas');

function* submitAppUsageSurveyWorker(action :SequenceAction) :Saga<*> {

  const { id, value } = action;

  try {
    yield put(submitAppUsageSurvey.request(id, value));
    const { data, participantId, studyId } = value;
    yield call(AppUsageSurveyApi.submitAppUsageSurvey, studyId, participantId, data);
    yield put(submitAppUsageSurvey.success(id, data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitAppUsageSurvey.failure(id, toSagaError(error)));
  }
  finally {
    yield put(submitAppUsageSurvey.finally(id));
  }
}

function* submitAppUsageSurveyWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_APP_USAGE_SURVEY, submitAppUsageSurveyWorker);
}

export {
  submitAppUsageSurveyWorker,
  submitAppUsageSurveyWatcher,
};
