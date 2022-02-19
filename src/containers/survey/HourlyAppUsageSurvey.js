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
import { submitSurvey } from './SurveyActions';
import { createHourlySurveySubmissionData } from './utils';

import BasicErrorComponent from '../shared/BasicErrorComponent';

const { isFailure, isSuccess, isPending } = ReduxUtils;

const initialState = {
  childOnlyApps: Set().asMutable(),
  initialTimeRangeSelections: Map().asMutable(),
  isConfirmModalVisible: false,
  isInstructionsModalVisible: false,
  isSubmissionConfirmed: false,
  otherTimeRangeSelections: Map().asMutable(),
  sharedApps: Set().asMutable(),
  step: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ASSIGN_USER: {
      const { childOnly, appName } = action;

      const { childOnlyApps, sharedApps } = state;

      const selected = childOnly ? childOnlyApps : sharedApps;

      if (selected.has(appName)) {
        selected.delete(appName);
      }
      else {
        selected.add(appName);
      }

      if (childOnly) {
        return {
          ...state,
          childOnlyApps: selected
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
      const { appName, timeRange, initial } = action;
      const { initialTimeRangeSelections, otherTimeRangeSelections } = state;

      const updatedValue = initial ? initialTimeRangeSelections : otherTimeRangeSelections;

      updatedValue.update(
        appName,
        Set(),
        (current) => (current.has(timeRange) ? current.delete(timeRange) : current.add(timeRange))
      );

      if (initial) {
        return {
          ...state,
          initialTimeRangeSelections: updatedValue
        };
      }
      return {
        ...state,
        remainingTimeRangeOptions: updatedValue
      };
    }
    case ACTIONS.NEXT_STEP: {
      return {
        ...state,
        step: state.step + 1
      };
    }
    case ACTIONS.PREV_STEP: {
      return {
        ...state,
        step: state.step - 1
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
  } = props;

  const storeDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    step,
    childOnlyApps,
    isConfirmModalVisible,
    initialTimeRangeSelections,
    otherTimeRangeSelections,
    isSubmissionConfirmed,
    isInstructionsModalVisible
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

      storeDispatch(submitSurvey({
        participantId,
        submissionData,
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
                  : <HourlySurvey data={data} state={state} isSubmitting={isSubmitting} />
              }
            </CardSegment>
          </Card>
        </AppContentWrapper>
      </AppContainerWrapper>
      {
        isConfirmModalVisible && <ConfirmSurveySubmissionModal />
      }
      {
        isInstructionsModalVisible && <InstructionsModal step={step} />
      }
    </HourlySurveyDispatch.Provider>
  );
};

export default HourlyAppUsageSurvey;
