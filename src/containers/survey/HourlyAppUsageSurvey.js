import { Set, fromJS } from 'immutable';
import {
  AppContainerWrapper,
  AppContentWrapper,
  Box,
  Card,
  CardSegment,
  DatePicker,
  Spinner,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BasicErrorComponent } from '../../common/components';
import { APP_USAGE_SURVEY, AppUsageFreqTypes } from '../../common/constants';
import {
  isFailure,
  isPending,
  isSuccess,
  useRequestState
} from '../../common/utils';
import { selectAppUsageSurveyData } from '../../core/redux/selectors';
import {
  GET_APP_USAGE_SURVEY_DATA,
  SUBMIT_APP_USAGE_SURVEY,
  getAppUsageSurveyData,
  submitAppUsageSurvey,
} from './actions';
import ConfirmSurveySubmissionModal from './components/ConfirmSurveySubmissionModal';
import HourlySurvey from './components/HourlySurvey';
import HourlySurveyDispatch, { ACTIONS } from './components/HourlySurveyDispatch';
import HourlyUsageSurveyAppBar from './components/HourlyUsageSurveyAppBar';
import InstructionsModal from './components/InstructionsModal';
import SubmissionSuccessful from './components/SubmissionSuccessful';
import { SURVEY_STEPS } from './constants';
import { createHourlySurveySubmissionData } from './utils';

const SELECT_DATE_TEXT = 'Thank you for taking the time to complete this survey! Please select a date'
  + ' for which to view app usage records.';

const {
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
  RESOLVE_SHARED_APPS,
  RESOLVE_OTHER_APPS,
  INTRO
} = SURVEY_STEPS;

const INITIAL_STATE = fromJS({
  appsCount: 0,
  appsData: {},
  childOnlyApps: Set(),
  initialTimeRangeSelections: {},
  isConfirmModalVisible: false,
  isFinalStep: false,
  isInstructionsModalVisible: false,
  isSubmissionConfirmed: false,
  otherTimeRangeSelections: {},
  sharedApps: Set(),
  sharedAppsOptionsCount: 0,
  step: 0,
  surveyStep: INTRO,
});

const reducer = (state, action) => {

  const getNextStep = (currentSurveyStep, sharedApps) => {
    let isFinalStep = false;
    let nextStep = '';
    if (currentSurveyStep === INTRO) {
      nextStep = SELECT_CHILD_APPS;
    }
    if (currentSurveyStep === SELECT_CHILD_APPS) {
      nextStep = SELECT_SHARED_APPS;
      isFinalStep = true; // User might choose not to select anything from the shared apps page
      // in which case they should be able to submit the survey. However, if they select anything
      // we need to set isFinalStep = false so that they can move on to the next page
    }
    if (currentSurveyStep === SELECT_SHARED_APPS) {
      if (sharedApps.isEmpty()) {
        // No shared apps selected: skip time-resolution steps
        isFinalStep = true;
      }
      else {
        nextStep = RESOLVE_SHARED_APPS;
      }
    }
    if (currentSurveyStep === RESOLVE_SHARED_APPS) {
      nextStep = RESOLVE_OTHER_APPS;
      isFinalStep = true;
    }
    return { isFinalStep, nextStep };
  };

  const getPrevStep = (currentSurveyStep) => {
    if (currentSurveyStep === RESOLVE_OTHER_APPS) {
      return RESOLVE_SHARED_APPS;
    }
    if (currentSurveyStep === RESOLVE_SHARED_APPS) {
      return SELECT_SHARED_APPS;
    }
    if (currentSurveyStep === SELECT_SHARED_APPS) {
      return SELECT_CHILD_APPS;
    }
    return INTRO;
  };

  switch (action.type) {
    case ACTIONS.ASSIGN_USER: {
      const { appName } = action;
      const appsCount = state.get('appsCount');
      const childOnlyApps = state.get('childOnlyApps');
      const sharedApps = state.get('sharedApps');
      const surveyStep = state.get('surveyStep');

      let selected = surveyStep === SELECT_CHILD_APPS ? Set(childOnlyApps) : Set(sharedApps);
      if (selected.has(appName)) {
        selected = selected.delete(appName);
      }
      else {
        selected = selected.add(appName);
      }

      if (surveyStep === SELECT_CHILD_APPS) {
        // If user select all apps, enable submit
        // const isFinalStep = selected.size === appsCount;
        return state
          .set('childOnlyApps', selected)
          .set('isFinalStep', selected.size === appsCount);
      }

      return state
        .set('isFinalStep', selected.isEmpty())
        .set('sharedApps', selected);
    }
    case ACTIONS.TOGGLE_INSTRUCTIONS_MODAL: {
      return state.set('isInstructionsModalVisible', action.visible);
    }
    case ACTIONS.SELECT_TIME_RANGE: {
      const { appName, timeRange } = action;
      const initialTimeRangeSelections = state.get('initialTimeRangeSelections');
      const otherTimeRangeSelections = state.get('otherTimeRangeSelections');
      const sharedAppsOptionsCount = state.get('sharedAppsOptionsCount');
      const surveyStep = state.get('surveyStep');
      let updatedValue = surveyStep === RESOLVE_SHARED_APPS ? initialTimeRangeSelections : otherTimeRangeSelections;

      updatedValue = updatedValue.update(
        appName,
        Set(),
        (current) => (current.has(timeRange) ? current.delete(timeRange) : current.add(timeRange))
      );

      if (surveyStep === RESOLVE_SHARED_APPS) {
        // Here we count the number of selections so far and compare with the total number of
        // possible selections. If equal, indicate survey as done by setting isFinalStep = true
        const currentSelectionsCount = updatedValue.keySeq().toSet()
          .map((key) => updatedValue.get(key).size)
          .reduce((prev, next) => prev + next);
        return state
          .set('initialTimeRangeSelections', updatedValue)
          .set('isFinalStep', currentSelectionsCount === sharedAppsOptionsCount);
      }
      return state.set('otherTimeRangeSelections', updatedValue);
    }
    case ACTIONS.NEXT_STEP: {
      const currentSurveyStep = state.get('surveyStep');
      const sharedApps = state.get('sharedApps');
      let sharedAppsOptionsCount = state.get('sharedAppsOptionsCount');

      if (currentSurveyStep === SELECT_SHARED_APPS) {
        // When navigating away from the shared apps selection page,
        // we calculate total number of possible selections available for next step(s) of survey
        sharedAppsOptionsCount = sharedApps
          .map((app) => state.getIn(['appsData', app, 'data'], Set()).size)
          .reduce((prev, next) => prev + next);
      }

      const { isFinalStep, nextStep } = getNextStep(currentSurveyStep, sharedApps);
      return state
        .set('isFinalStep', isFinalStep)
        .set('sharedAppsOptionsCount', sharedAppsOptionsCount)
        .set('step', state.get('step') + 1)
        .set('surveyStep', nextStep);
    }
    case ACTIONS.PREV_STEP: {
      const currentSurveyStep = state.get('surveyStep');
      return state
        .set('isFinalStep', false)
        .set('step', state.get('step') - 1)
        .set('surveyStep', getPrevStep(currentSurveyStep));
    }
    case ACTIONS.CONFIRM_SUBMIT: {
      return state
        .set('isConfirmModalVisible', false)
        .set('isSubmissionConfirmed', true);
    }
    case ACTIONS.CANCEL_SUBMIT: {
      return state.set('isConfirmModalVisible', false);
    }
    case ACTIONS.SHOW_CONFIRM_MODAL: {
      return state.set('isConfirmModalVisible', true);
    }
    case ACTIONS.SET_DATA: {
      return state
        .set('appsCount', action.data.keySeq().size)
        .set('appsData', action.data);
    }
    case ACTIONS.RESET: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

const HourlyAppUsageSurvey = ({
  date,
  participantId,
  studyId,
}) => {

  const storeDispatch = useDispatch();
  const [surveyDate, setSurveyDate] = useState();

  const data = useSelector(selectAppUsageSurveyData());
  const getAppUsageSurveyDataRS = useRequestState([APP_USAGE_SURVEY, GET_APP_USAGE_SURVEY_DATA]);
  const submitRS = useRequestState([APP_USAGE_SURVEY, SUBMIT_APP_USAGE_SURVEY]);

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const childOnlyApps = state.get('childOnlyApps');
  const initialTimeRangeSelections = state.get('initialTimeRangeSelections');
  const isConfirmModalVisible = state.get('isConfirmModalVisible');
  const isInstructionsModalVisible = state.get('isInstructionsModalVisible');
  const isSubmissionConfirmed = state.get('isSubmissionConfirmed');
  const otherTimeRangeSelections = state.get('otherTimeRangeSelections');
  const step = state.get('step');
  const surveyStep = state.get('surveyStep');

  useEffect(() => {
    if (typeof date === 'string') {
      const maybeDate = DateTime.fromFormat(date, 'yyyy-MM-dd');
      if (maybeDate.isValid) {
        setSurveyDate(maybeDate.toISODate());
      }
    }
  }, [date]);

  useEffect(() => {
    if (isSuccess(getAppUsageSurveyDataRS)) {
      dispatch({ data, type: ACTIONS.SET_DATA });
    }
  }, [data, getAppUsageSurveyDataRS]);

  useEffect(() => {
    if (typeof surveyDate === 'string') {
      dispatch({ type: ACTIONS.RESET });
      storeDispatch(
        getAppUsageSurveyData({
          appUsageFreqType: AppUsageFreqTypes.HOURLY,
          date: surveyDate,
          participantId,
          studyId,
        })
      );
    }
  }, [
    participantId,
    storeDispatch,
    studyId,
    surveyDate,
  ]);

  useEffect(() => {
    if (isSubmissionConfirmed) {
      const timeRangeSelections = initialTimeRangeSelections.mergeWith(
        (oldVal, newVal) => oldVal.concat(newVal),
        otherTimeRangeSelections
      );
      const submissionData = createHourlySurveySubmissionData(
        data,
        childOnlyApps,
        timeRangeSelections
      );

      storeDispatch(submitAppUsageSurvey({
        data: submissionData,
        participantId,
        studyId,
      }));
    }
  }, [
    childOnlyApps,
    data,
    initialTimeRangeSelections,
    isSubmissionConfirmed,
    otherTimeRangeSelections,
    participantId,
    storeDispatch,
    studyId,
  ]);

  if (isSuccess(submitRS) || isFailure(submitRS)) {
    return (
      <HourlySurveyDispatch.Provider value={dispatch}>
        <AppContainerWrapper>
          <HourlyUsageSurveyAppBar step={step} />
          <AppContentWrapper>
            {
              isSuccess(submitRS)
                ? <SubmissionSuccessful />
                : <BasicErrorComponent />
            }
          </AppContentWrapper>
        </AppContainerWrapper>
      </HourlySurveyDispatch.Provider>
    );
  }

  return (
    <HourlySurveyDispatch.Provider value={dispatch}>
      <AppContainerWrapper>
        <HourlyUsageSurveyAppBar date={date} step={step} />
        <AppContentWrapper>
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
                    isSuccess(getAppUsageSurveyDataRS) && (
                      <HourlySurvey
                          data={data}
                          isSubmitting={isPending(submitRS)}
                          state={state} />
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
      {
        isConfirmModalVisible && <ConfirmSurveySubmissionModal />
      }
      {
        isInstructionsModalVisible && <InstructionsModal step={step} surveyStep={surveyStep} />
      }
    </HourlySurveyDispatch.Provider>
  );
};

export default HourlyAppUsageSurvey;
