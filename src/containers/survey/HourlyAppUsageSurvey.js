// @flow
import { useEffect, useReducer } from 'react';

import {
  Map,
  Set,
} from 'immutable';
import {
  AppContainerWrapper,
  AppContentWrapper,
  Card,
  CardSegment,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import ConfirmSurveySubmissionModal from './components/ConfirmSurveySubmissionModal';
import HourlySurvey from './components/HourlySurvey';
import HourlyUsageSurveyAppBar from './components/HourlyUsageSurveyAppBar';
import InstructionsModal from './components/InstructionsModal';
import SubmissionSuccessful from './components/SubmissionSuccessful';
import HourlySurveyDispatch, { ACTIONS } from './components/HourlySurveyDispatch';
import { submitAppUsageSurvey } from './actions';
import { SURVEY_STEPS } from './constants';
import { createHourlySurveySubmissionData } from './utils';

import { BasicErrorComponent } from '../../common/components';

const { isFailure, isSuccess, isPending } = ReduxUtils;

const {
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
  RESOLVE_SHARED_APPS,
  RESOLVE_OTHER_APPS,
  INTRO
} = SURVEY_STEPS;

const initialState = {
  childOnlyApps: Set().asMutable(),
  initialTimeRangeSelections: Map().asMutable(),
  isConfirmModalVisible: false,
  isInstructionsModalVisible: false,
  isSubmissionConfirmed: false,
  isFinalStep: false,
  otherTimeRangeSelections: Map().asMutable(),
  sharedApps: Set().asMutable(),
  step: 0,
  surveyStep: INTRO,
  sharedAppsOptionsCount: 0,
};

const reducer = (state, action) => {

  const getNextStep = () => {
    let isFinalStep = false;
    let nextStep = '';
    const {
      surveyStep,
      sharedApps,
    } = state;
    if (surveyStep === INTRO) {
      nextStep = SELECT_CHILD_APPS;
    }
    if (surveyStep === SELECT_CHILD_APPS) {
      nextStep = SELECT_SHARED_APPS;
    }

    if (surveyStep === SELECT_SHARED_APPS) {
      if (sharedApps.isEmpty()) {
        // No shared apps selected: skip time-resolution steps
        isFinalStep = true;
      }
      else {
        nextStep = RESOLVE_SHARED_APPS;
      }
    }
    if (surveyStep === RESOLVE_SHARED_APPS) {
      nextStep = RESOLVE_OTHER_APPS;
      isFinalStep = true;
    }

    return { isFinalStep, nextStep };
  };

  const getPrevStep = () => {
    const {
      surveyStep
    } = state;

    if (surveyStep === RESOLVE_OTHER_APPS) {
      return RESOLVE_SHARED_APPS;
    }
    if (surveyStep === RESOLVE_SHARED_APPS) {
      return SELECT_SHARED_APPS;
    }
    if (surveyStep === SELECT_SHARED_APPS) {
      return SELECT_CHILD_APPS;
    }
    return INTRO;
  };

  switch (action.type) {
    case ACTIONS.ASSIGN_USER: {
      const { childOnly, appName } = action;

      const { childOnlyApps, sharedApps, appsCount } = state;

      const selected = childOnly ? childOnlyApps : sharedApps;

      if (selected.has(appName)) {
        selected.delete(appName);
      }
      else {
        selected.add(appName);
      }

      if (childOnly) {
        // If all apps are indicated as having been used by child, skip all other steps and present button to submit
        const isFinalStep = selected.size === appsCount;
        return {
          ...state,
          childOnlyApps: selected,
          isFinalStep
        };
      }
      return {
        ...state,
        sharedApps: selected
      };
    }

    case ACTIONS.TOGGLE_INSTRUCTIONS_MODAL: {
      const { visible } = action;
      return {
        ...state,
        isInstructionsModalVisible: visible
      };
    }

    case ACTIONS.SELECT_TIME_RANGE: {
      const { appName, timeRange } = action;
      const {
        initialTimeRangeSelections,
        otherTimeRangeSelections,
        sharedAppsOptionsCount,
        surveyStep,
      } = state;

      const updatedValue = surveyStep === RESOLVE_SHARED_APPS ? initialTimeRangeSelections : otherTimeRangeSelections;

      updatedValue.update(
        appName,
        Set(),
        (current) => (current.has(timeRange) ? current.delete(timeRange) : current.add(timeRange))
      );

      if (surveyStep === RESOLVE_SHARED_APPS) {
        // Here we count the number of selections so far and compare with the total number of
        // possible selections. If equal, indicate survey as done by setting isFinalStep = true
        const currentSelectionsCount = updatedValue.keySeq().toSet().map((key) => updatedValue.get(key).size)
          .reduce((prev, next) => prev + next);

        const isFinalStep = currentSelectionsCount === sharedAppsOptionsCount;
        return {
          ...state,
          initialTimeRangeSelections: updatedValue,
          isFinalStep
        };
      }
      return {
        ...state,
        remainingTimeRangeOptions: updatedValue
      };
    }
    case ACTIONS.NEXT_STEP: {
      const {
        surveyStep,
        sharedAppsOptionsCount,
        appsData,
        sharedApps
      } = state;
      let optionsCount = sharedAppsOptionsCount;

      if (surveyStep === SELECT_SHARED_APPS) {
        // When navigating away from the shared apps selection page,
        // we calculate total number of possible selections available for next step(s) of survey
        optionsCount = sharedApps.asImmutable()
          .map((app) => appsData.getIn([app, 'data']).size)
          .reduce((prev, next) => prev + next);
      }

      const { isFinalStep, nextStep } = getNextStep();
      return {
        ...state,
        isFinalStep,
        step: state.step + 1,
        surveyStep: nextStep,
        sharedApps: sharedApps.asMutable(),
        sharedAppsOptionsCount: optionsCount
      };
    }
    case ACTIONS.PREV_STEP: {
      return {
        ...state,
        isFinalStep: false,
        step: state.step - 1,
        surveyStep: getPrevStep(),
      };
    }
    case ACTIONS.CONFIRM_SUBMIT: {
      return {
        ...state,
        isSubmissionConfirmed: true,
        isConfirmModalVisible: false
      };
    }
    case ACTIONS.CANCEL_SUBMIT: {
      return {
        ...state,
        isConfirmModalVisible: false
      };
    }
    case ACTIONS.SHOW_CONFIRM_MODAL: {
      return {
        ...state,
        isConfirmModalVisible: true
      };
    }
    default:
      return state;
  }
};

type Props = {
  data :Map;
  date :string;
  submitSurveyRS :?RequestState;
  getAppUsageSurveyDataRS :?RequestState;
  participantId :string;
  studyId :UUID ;
};

const HourlyAppUsageSurvey = (props :Props) => {
  const {
    data,
    date,
    studyId,
    participantId,
    submitSurveyRS,
    getAppUsageSurveyDataRS,
  } = props;

  const storeDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    appsData: data,
    appsCount: data.keySeq().size
  });

  const {
    step,
    surveyStep,
    childOnlyApps,
    isConfirmModalVisible,
    initialTimeRangeSelections,
    otherTimeRangeSelections,
    isSubmissionConfirmed,
    isInstructionsModalVisible,
  } = state;

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
    participantId,
    otherTimeRangeSelections,
    storeDispatch,
    studyId,
  ]);

  const hasSubmitted = isSuccess(submitSurveyRS) || isFailure(submitSurveyRS);

  const isSubmitting = isPending(submitSurveyRS);

  const SubmissionCompleted = () => (
    <>
      {
        isSuccess(submitSurveyRS)
          ? <SubmissionSuccessful />
          : <BasicErrorComponent />
      }
    </>
  );

  return (
    <HourlySurveyDispatch.Provider value={dispatch}>
      <AppContainerWrapper>
        <HourlyUsageSurveyAppBar date={date} step={step} />
        <AppContentWrapper>
          <Card>
            <CardSegment noBleed>
              {
                hasSubmitted
                  ? <SubmissionCompleted />
                  : (
                    <HourlySurvey
                        data={data}
                        getAppUsageSurveyDataRS={getAppUsageSurveyDataRS}
                        isSubmitting={isSubmitting}
                        state={state} />
                  )
              }
            </CardSegment>
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
