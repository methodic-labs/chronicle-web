import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  Box,
  Card,
  CardSegment,
  DatePicker,
  Spinner
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import { APP_USAGE_SURVEY, AppUsageFreqTypes } from '../../common/constants';
import {
  isFailure,
  isPending,
  isSuccess,
  useRequestState
} from '../../common/utils';
import { selectAppUsageSurveyData } from '../../core/redux/selectors';
import { GET_APP_USAGE_SURVEY_DATA, SUBMIT_APP_USAGE_SURVEY, getAppUsageSurveyData } from './actions';
import SubmissionSuccessful from './components/SubmissionSuccessful';
import SurveyForm from './components/SurveyForm';

const SELECT_DATE_TEXT = 'Thank you for taking the time to complete this survey! Please select a date'
  + ' for which to view app usage records.';

const INSTRUCTIONS_TEXT = 'Below, you will find a list of apps that were used on this device on the'
+ ' selected date. Under each app, there will be a series of buttons you can click (you can click more'
+ ' than one) describing who in your family used that app. Please answer these prompts to the best of'
+ ' your ability. For example, if you and your child both watched YouTube separately, you would click'
+ ' "Parent Alone" and "Child Alone." If you both used this app together, as well as separately, you'
+ ' would click "Parent Alone," "Child Alone," and "Parent and Child Together."';

const NO_APPS_TEXT = 'There is no recorded app usage for the selected date.'
 + ' Thank you for your participation, the survey is not needed.';

const DailyAppUsageSurvey = ({
  date,
  participantId,
  studyId,
}) => {
  const dispatch = useDispatch();
  const [surveyDate, setSurveyDate] = useState();

  useEffect(() => {
    if (typeof date === 'string') {
      const maybeDate = DateTime.fromFormat(date, 'yyyy-MM-dd');
      if (maybeDate.isValid) {
        setSurveyDate(maybeDate.toISODate());
      }
    }
  }, [date]);

  const data = useSelector(selectAppUsageSurveyData());
  const getAppUsageSurveyDataRS = useRequestState([APP_USAGE_SURVEY, GET_APP_USAGE_SURVEY_DATA]);
  const submitRS = useRequestState([APP_USAGE_SURVEY, SUBMIT_APP_USAGE_SURVEY]);

  useEffect(() => {
    if (typeof surveyDate === 'string') {
      dispatch(
        getAppUsageSurveyData({
          appUsageFreqType: AppUsageFreqTypes.DAILY,
          date: surveyDate,
          participantId,
          studyId,
        })
      );
    }
  }, [
    dispatch,
    participantId,
    studyId,
    surveyDate,
  ]);

  if (isSuccess(submitRS)) {
    return (
      <AppContainerWrapper>
        <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
        <AppContentWrapper>
          <SubmissionSuccessful />
        </AppContentWrapper>
      </AppContainerWrapper>
    );
  }

  return (
    <AppContainerWrapper>
      <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
      <AppContentWrapper>
        <Box fontSize="20px" mb="32px">
          App Usage Survey
        </Box>
        <Card>
          <CardSegment noBleed>
            <Box mb="32px">{SELECT_DATE_TEXT}</Box>
            <Box maxWidth="300px">
              <DatePicker
                  onChange={(value) => setSurveyDate(value)}
                  value={surveyDate} />
            </Box>
          </CardSegment>
          {
            typeof surveyDate === 'string' && (
              <CardSegment noBleed>
                {
                  isPending(getAppUsageSurveyDataRS) && (
                    <Spinner size="2x" />
                  )
                }
                {
                  isSuccess(getAppUsageSurveyDataRS) && data.isEmpty() && (
                    <div>{NO_APPS_TEXT}</div>
                  )
                }
                {
                  isSuccess(getAppUsageSurveyDataRS) && !data.isEmpty() && (
                    <>
                      <Box mb="16px">{INSTRUCTIONS_TEXT}</Box>
                      <SurveyForm
                          data={data}
                          participantId={participantId}
                          studyId={studyId}
                          submitSurveyRS={submitRS} />
                    </>
                  )
                }
                {
                  isFailure(getAppUsageSurveyDataRS) && (
                    <Box textAlign="center">
                      Sorry, something went wrong. Please try refreshing the page, or contact support.
                    </Box>
                  )
                }
              </CardSegment>
            )
          }
        </Card>
      </AppContentWrapper>
    </AppContainerWrapper>
  );
};

export default DailyAppUsageSurvey;
