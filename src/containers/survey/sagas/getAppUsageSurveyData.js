/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { AxiosUtils, Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import * as AppUsageSurveyApi from '../../../core/api/appusagesurvey';
import {
  APP_LABEL,
  APP_PACKAGE_NAME,
  AppUsageFreqTypes,
  DATA,
  TIMESTAMP,
  TIMEZONE,
} from '../../../common/constants';
import { GET_APP_USAGE_SURVEY_DATA, getAppUsageSurveyData } from '../actions';

const { toSagaError } = AxiosUtils;

const LOG = new Logger('SurveySagas');

const convertTo12hourFormat = (dateStr :string) => {
  const tokens = dateStr.split(' ');
  return `${tokens[0].split(':')[0]}${tokens[1].toLowerCase()}`;
};

// returns 9am - 10am
const getTimeRange = (dateTime :DateTime) => {
  const start = dateTime.startOf('hour').toLocaleString(DateTime.TIME_SIMPLE);
  const end = dateTime.plus({ hours: 1 }).startOf('hour').toLocaleString(DateTime.TIME_SIMPLE);

  return `${convertTo12hourFormat(start)} - ${convertTo12hourFormat(end)}`;
};

function* getAppUsageSurveyDataWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getAppUsageSurveyData.request(id, value));

    const {
      appUsageFreqType,
      date,
      participantId,
      studyId,
    } = value;

    const response = yield call(AppUsageSurveyApi.getAppUsageSurveyData, studyId, participantId, date);

    let data;

    if (appUsageFreqType === AppUsageFreqTypes.HOURLY) {
      data = Map().withMutations((mutator) => {
        fromJS(response).forEach((usage) => {
          const appPackageName = usage.get(APP_PACKAGE_NAME);
          const appLabel = usage.get(APP_LABEL);
          mutator.setIn([appPackageName, APP_LABEL], appLabel);
          const timestamp = usage.get(TIMESTAMP);
          const timezone = usage.get(TIMEZONE);
          const dateTime = DateTime.fromISO(timestamp, { zone: timezone });
          const timeRange = getTimeRange(dateTime);
          mutator.updateIn([appPackageName, DATA, timeRange], List(), (list) => list.push(usage));
        });
      });
    }
    else {
      data = fromJS(response).groupBy((entity) => entity.get(APP_PACKAGE_NAME));
    }

    workerResponse = { data };
    yield put(getAppUsageSurveyData.success(id, data));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getAppUsageSurveyData.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getAppUsageSurveyData.finally(id));
  }

  return workerResponse;
}

function* getAppUsageSurveyDataWatcher() :Saga<*> {

  yield takeEvery(GET_APP_USAGE_SURVEY_DATA, getAppUsageSurveyDataWorker);
}

export {
  getAppUsageSurveyDataWorker,
  getAppUsageSurveyDataWatcher,
};
