// @flow

import { useEffect } from 'react';

import qs from 'qs';
import { Map } from 'immutable';
// $FlowFixMe
import { Box, Spinner } from 'lattice-ui-kit';
import { ReduxUtils, useRequestState } from 'lattice-utils';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RequestState } from 'redux-reqseq';

import DailyAppUsageSurvey from './DailyAppUsageSurvey';
import HourlyAppUsageSurvey from './HourlyAppUsageSurvey';
import { GET_APP_USAGE_SURVEY_DATA, SUBMIT_SURVEY, getAppUsageSurveyData } from './SurveyActions';

import AppUsageFreqTypes from '../../utils/constants/AppUsageFreqTypes';
import Settings from '../../utils/constants/AppSettings';
import * as AppModules from '../../utils/constants/AppModules';
import { APP_REDUX_CONSTANTS, REDUCERS } from '../../utils/constants/ReduxConstants';
import { GET_DATA_COLLECTION_SETTINGS, getDataCollectionSettings } from '../app/AppActions';
import type { AppUsageFreqType } from '../../utils/constants/AppUsageFreqTypes';

const { SETTINGS } = APP_REDUX_CONSTANTS;

const { isPending, isStandby } = ReduxUtils;

const SurveyContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const {
    date = DateTime.local().toISODate(),
    organizationId,
    participantId,
    studyId
    // $FlowFixMe
  } :{ date :string, organizationId :UUID, participantId :string, studyId :UUID } = queryParams;

  // selectors
  const settings = useSelector((state) => state.getIn([REDUCERS.APP, SETTINGS], Map()));
  const userAppsData = useSelector((state) => state.getIn([REDUCERS.APPS_DATA, 'appsData'], Map()));

  const getUserAppsRS :?RequestState = useRequestState([REDUCERS.APPS_DATA, GET_APP_USAGE_SURVEY_DATA]);
  const getDataCollectionSettingsRS :?RequestState = useRequestState([REDUCERS.APP, GET_DATA_COLLECTION_SETTINGS]);
  const submitSurveyRS :?RequestState = useRequestState([REDUCERS.APPS_DATA, SUBMIT_SURVEY]);

  const appUsageFreqType :AppUsageFreqType = settings.getIn(
    [AppModules.DATA_COLLECTION, organizationId, Settings.APP_USAGE_FREQUENCY]
  ) || AppUsageFreqTypes.DAILY;

  useEffect(() => {
    dispatch(getDataCollectionSettings({
      organizationId
    }));
  }, [organizationId, dispatch]);

  // get apps
  useEffect(() => {
    dispatch(getAppUsageSurveyData({
      date,
      participantId,
      organizationId,
      studyId,
      appUsageFreqType
    }));
  }, [date, participantId, organizationId, studyId, appUsageFreqType, dispatch]);

  if (isPending(getDataCollectionSettingsRS) || isStandby(getDataCollectionSettingsRS) || isPending(getUserAppsRS)) {
    return (
      <Box mt="60px" textAlign="center">
        <Spinner size="2x" />
      </Box>
    );
  }

  if (appUsageFreqType === AppUsageFreqTypes.HOURLY) {
    return (
      <HourlyAppUsageSurvey
          data={userAppsData}
          date={date}
          getUserAppsRS={getUserAppsRS}
          organizationId={organizationId}
          participantId={participantId}
          studyId={studyId}
          submitSurveyRS={submitSurveyRS} />
    );
  }

  return (
    <DailyAppUsageSurvey
        data={userAppsData}
        date={date}
        getUserAppsRS={getUserAppsRS}
        organizationId={organizationId}
        participantId={participantId}
        studyId={studyId}
        submitSurveyRS={submitSurveyRS} />
  );
};

export default SurveyContainer;
