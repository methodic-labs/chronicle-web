import { useEffect } from 'react';

import {
  Alert,
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  Box,
  Card,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import DailyAppUsageSurvey from './DailyAppUsageSurvey';
import HourlyAppUsageSurvey from './HourlyAppUsageSurvey';

import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import {
  APP_USAGE_FREQUENCY,
  AppUsageFreqTypes,
  DATA_COLLECTION,
  STUDIES
} from '../../common/constants';
import {
  isFailure,
  isPending,
  isStandby,
  useRequestState,
} from '../../common/utils';
import { selectStudySettings } from '../../core/redux/selectors';
import { GET_STUDY_SETTINGS, getStudySettings } from '../study/actions';

const SurveyContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const {
    participantId,
    studyId,
  } = queryParams;

  const studySettings = useSelector(selectStudySettings(studyId));
  const getStudySettingsRS = useRequestState([STUDIES, GET_STUDY_SETTINGS]);

  const appUsageFreqType = studySettings.getIn(
    [DATA_COLLECTION, APP_USAGE_FREQUENCY]
  ) || AppUsageFreqTypes.DAILY;

  useEffect(() => {
    dispatch(getStudySettings(studyId));
  }, [dispatch, studyId]);

  if (isPending(getStudySettingsRS) || isStandby(getStudySettingsRS)) {
    return (
      <Box mt="60px" textAlign="center">
        <Spinner size="2x" />
      </Box>
    );
  }

  if (isFailure(getStudySettingsRS)) {
    return (
      <AppContainerWrapper>
        <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
        <AppContentWrapper>
          <Card>
            <CardSegment>
              <Alert severity="error">
                Sorry, An error occurred when fetching survey data. Please try again later.
              </Alert>
            </CardSegment>
          </Card>
        </AppContentWrapper>
      </AppContainerWrapper>
    );
  }

  if (appUsageFreqType === AppUsageFreqTypes.HOURLY) {
    return (
      <HourlyAppUsageSurvey
          date={queryParams.date}
          participantId={participantId}
          studyId={studyId} />
    );
  }

  return (
    <DailyAppUsageSurvey
        date={queryParams.date}
        participantId={participantId}
        studyId={studyId} />
  );
};

export default SurveyContainer;
