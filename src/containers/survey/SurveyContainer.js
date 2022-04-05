/*
 * @flow
 */

import { useEffect } from 'react';

import qs from 'qs';
import { Box, Spinner } from 'lattice-ui-kit';
import { ReduxUtils, useRequestState } from 'lattice-utils';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RequestState } from 'redux-reqseq';

import DailyAppUsageSurvey from './DailyAppUsageSurvey';
import HourlyAppUsageSurvey from './HourlyAppUsageSurvey';
import { GET_APP_USAGE_SURVEY_DATA, SUBMIT_APP_USAGE_SURVEY, getAppUsageSurveyData } from './actions';

import {
  APP_USAGE_FREQUENCY,
  APP_USAGE_SURVEY,
  AppUsageFreqTypes,
  STUDIES,
} from '../../common/constants';
import { selectAppUsageSurveyData, selectStudySettings } from '../../core/redux/selectors';
import { GET_STUDY_SETTINGS, getStudySettings } from '../study/actions';
import type { AppUsageFreqType } from '../../common/types';

const { isPending, isStandby } = ReduxUtils;

const SurveyContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const {
    date = DateTime.local().toISODate(),
    participantId,
    studyId
    // $FlowFixMe
  } :{ date :string, participantId :string, studyId :UUID } = queryParams;

  // selectors
  const studySettings = useSelector(selectStudySettings(studyId));
  const appUsageSurveyData = useSelector(selectAppUsageSurveyData());

  const getAppUsageSurveyDataRS :?RequestState = useRequestState([APP_USAGE_SURVEY, GET_APP_USAGE_SURVEY_DATA]);
  const getStudySettingsRS :?RequestState = useRequestState([STUDIES, GET_STUDY_SETTINGS]);
  const submitSurveyRS :?RequestState = useRequestState([APP_USAGE_SURVEY, SUBMIT_APP_USAGE_SURVEY]);

  const appUsageFreqType :AppUsageFreqType = studySettings.get(APP_USAGE_FREQUENCY) || AppUsageFreqTypes.DAILY;

  useEffect(() => {
    dispatch(getStudySettings(studyId));
  }, [studyId, dispatch]);

  // get apps
  useEffect(() => {
    dispatch(getAppUsageSurveyData({
      appUsageFreqType,
      date,
      participantId,
      studyId,
    }));
  }, [date, participantId, studyId, appUsageFreqType, dispatch]);

  if (isPending(getStudySettingsRS) || isStandby(getStudySettingsRS) || isPending(getAppUsageSurveyDataRS)) {
    return (
      <Box mt="60px" textAlign="center">
        <Spinner size="2x" />
      </Box>
    );
  }

  if (appUsageFreqType === AppUsageFreqTypes.HOURLY) {
    return (
      <HourlyAppUsageSurvey
          data={appUsageSurveyData}
          date={date}
          getAppUsageSurveyDataRS={getAppUsageSurveyDataRS}
          participantId={participantId}
          studyId={studyId}
          submitSurveyRS={submitSurveyRS} />
    );
  }

  return (
    <DailyAppUsageSurvey
        data={appUsageSurveyData}
        date={date}
        getAppUsageSurveyDataRS={getAppUsageSurveyDataRS}
        participantId={participantId}
        studyId={studyId}
        submitSurveyRS={submitSurveyRS} />
  );
};

export default SurveyContainer;
