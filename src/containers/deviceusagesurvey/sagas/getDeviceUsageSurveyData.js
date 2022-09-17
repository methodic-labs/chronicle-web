/*
 * @flow
 */

import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { DateTime, Interval } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as AppUsageSurveyApi from '../../../core/api/appusagesurvey';
import * as DeviceUsageSurveyApi from '../../../core/api/deviceusagesurvey';
import {
  APP_LABEL,
  APP_PACKAGE_NAME,
  DATA,
  TIMESTAMP,
  TIMEZONE,
} from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { GET_DEVICE_USAGE_SURVEY_DATA, getDeviceUsageSurveyData } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DeviceUsageSurveySagas');

function* getDeviceUsageSurveyDataWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getDeviceUsageSurveyData.request(id, value));

    console.log(value);

    const {
      dateFrom,
      dateTo,
      intervals,
      participantId,
      studyId,
    } :{
      dateFrom :DateTime;
      dateTo :DateTime;
      intervals :Interval[];
      participantId :string;
      studyId :UUID;
    } = value;

    yield call(
      DeviceUsageSurveyApi.getDeviceUsageSurveyData,
      studyId,
      participantId,
      dateFrom,
      dateTo,
    );

    // const calls = {};
    // intervals.forEach((interval) => {
    //   calls[interval.toString()] = call(
    //     DeviceUsageSurveyApi.getDeviceUsageSurveyData,
    //     studyId,
    //     participantId,
    //     interval.start,
    //     interval.end,
    //   );
    // });

    // const responses = yield all(calls);
    // const temp = {};
    // intervals.forEach((interval) => {
    //   const intervalData = responses[interval.toString()];
    //   console.log(interval.toString(), intervalData);
    //   temp[interval.toString()] = {
    //     totalTime: Math.random() * 60 * 60,
    //   };
    // });

    // console.log(temp);

    // val totalTime: Double,
    // val usageByPackage: Map<String, Double>,
    // val categoryByPackage: Map<String, String>,
    // val users: List<String> = listOf()

    workerResponse = { data: {} };
    yield put(getDeviceUsageSurveyData.success(id));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getDeviceUsageSurveyData.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getDeviceUsageSurveyData.finally(id));
  }

  return workerResponse;
}

function* getDeviceUsageSurveyDataWatcher() :Saga<*> {

  yield takeEvery(GET_DEVICE_USAGE_SURVEY_DATA, getDeviceUsageSurveyDataWorker);
}

export {
  getDeviceUsageSurveyDataWorker,
  getDeviceUsageSurveyDataWatcher,
};
