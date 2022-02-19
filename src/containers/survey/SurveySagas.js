// @flow

import {
  call,
  put,
  takeEvery,
  takeLatest
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_APP_USAGE_SURVEY_DATA,
  SUBMIT_SURVEY,
  getAppUsageSurveyData,
  submitSurvey,
} from './SurveyActions';
import { createHourlySurveySubmissionData } from './utils';

import AppUsageFreqTypes from '../../utils/constants/AppUsageFreqTypes';
import * as ChronicleApi from '../../utils/api/ChronicleApi';

const LOG = new Logger('SurveySagas');

/*
 *
 * SurveyActions.submitSurvey()
 *
 */
function* submitSurveyWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(submitSurvey.request(action.id));

    const { value } = action;
    const {
      data,
      participantId,
      selectedApps,
      studyId,
      timeRangeSelections,
    } = value;

    const submissionData = createHourlySurveySubmissionData(data, selectedApps, timeRangeSelections);

    const response = yield call(
      ChronicleApi.submitAppUsageSurvey, studyId, participantId, submissionData.toJS()
    );
    if (response.error) throw response.error;

    yield put(submitSurvey.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitSurvey.failure(action.id));
  }
  finally {
    yield put(submitSurvey.finally(action.id));
  }
}

function* submitSurveyWatcher() :Generator<*, *, *> {
  yield takeEvery(SUBMIT_SURVEY, submitSurveyWorker);
}

/*
 *
 * SurveyActions.getChronicleApps()
 *
 */
function* getAppUsageSurveyDataWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getAppUsageSurveyData.request(action.id));

    const { value } = action;
    const {
      date,
      participantId,
      studyId,
      appUsageFreqType
    } = value;

    const response = yield call(
      ChronicleApi.getAppUsageSurveyData, date, participantId, studyId
    );
    if (response.error) throw response.error;

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

    /**
    {
      com.facebook.katana: {
        appLabel: 'Facebook',
        data: {
          '10am - 11am': [
              {
                timestamp: 2021-11-16T10:15:37.668+00:00,
                timezone: ''
              },
              {
                timestamp: 2021-11-16T10:15:37.668+00:00,
                timezone: ''
              }
            ]
          }
        }
      }
    }
    */

    let data;

    if (appUsageFreqType === AppUsageFreqTypes.HOURLY) {
      data = Map().withMutations((mutator) => {
        fromJS(response.data).forEach((usage) => {
          const appPackageName = usage.get('appPackageName');
          const appLabel = usage.get('appLabel');
          mutator.setIn([appPackageName, 'appLabel'], appLabel);

          const timestamp = usage.get('timestamp');
          const timezone = usage.get('timezone');
          const dateTime = DateTime.fromISO(timestamp, { zone: timezone });
          const timeRange = getTimeRange(dateTime);
          mutator.updateIn([appPackageName, 'data', timeRange], List(), (list) => list.push(usage));
        });
      });
    }
    else {
      // mapping from association EKID -> associationDetails & entityDetails
      /**
        {
          com.facebook.katana: [
            {
              appPackageName: 'com.facebook.katana',
              appLabel: 'Facebook',
              timezone: '',
            }
          ]
        }
      */
      data = fromJS(response.data).groupBy((entity) => entity.get('appPackageName'));
    }

    yield put(getAppUsageSurveyData.success(action.id, data));
  }

  catch (error) {
    LOG.error(action.type, error);
    yield put(getAppUsageSurveyData.failure(action.id));
  }
  finally {
    yield put(getAppUsageSurveyData.finally(action.id));
  }
}

function* getAppUsageSurveyDataWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_APP_USAGE_SURVEY_DATA, getAppUsageSurveyDataWorker);
}

export {
  getAppUsageSurveyDataWatcher,
  submitSurveyWatcher
};
