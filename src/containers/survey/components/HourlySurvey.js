// @flow

import { useMemo } from 'react';

import { Map } from 'immutable';
import { Box } from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import type { RequestState } from 'redux-reqseq';

import HourlySurveyInstructions from './HourlySurveyInstructions';
import SelectAppUsageTimeSlots from './SelectAppUsageTimeSlots';
import SelectAppsByUser from './SelectAppsByUser';
import SurveyButtons from './SurveyButtons';

import { SURVEY_STEPS } from '../constants';

const {
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
  RESOLVE_SHARED_APPS,
  RESOLVE_OTHER_APPS,
  INTRO
} = SURVEY_STEPS;

const { isFailure } = ReduxUtils;

type Props = {
  data :Map;
  isSubmitting :boolean;
  state :Object;
  getAppUsageSurveyDataRS :?RequestState
};

const HourlySurvey = (props :Props) => {

  const {
    data,
    getAppUsageSurveyDataRS,
    isSubmitting,
    state,
  } = props;

  const {
    childOnlyApps,
    initialTimeRangeSelections,
    isFinalStep,
    otherTimeRangeSelections,
    sharedApps,
    step,
    surveyStep
  } = state;

  const getInstructionText = () => {
    switch (surveyStep) {
      case SELECT_CHILD_APPS:
        return 'Select the apps that were used ONLY by your child';
      case SELECT_SHARED_APPS:
        return 'Select the apps that were used by both your child and others';
      case RESOLVE_SHARED_APPS:
        return 'Select the time(s) when  your  child  was the  primary user (at least 90%  of the time)';
      case RESOLVE_OTHER_APPS:
        return 'For the remaining times, select the times your child used the app at all';
      default:
        return '';
    }
  };

  const nextButtonText = useMemo(() => {
    if (isFinalStep) return 'Submit';
    if (surveyStep === INTRO) return 'Begin Survey';
    return 'Next';
  }, [isFinalStep, surveyStep]);

  const sharedAppsData = data.filterNot((val, key) => childOnlyApps.has(key));
  const timeRangeOptions = data.filter((val, key) => sharedApps.has(key));

  // const childAppsOtherOptions = getChildApppsOtherOptions();

  if (isFailure(getAppUsageSurveyDataRS)) {
    return (
      <Box textAlign="center">
        Sorry, something went wrong. Please try refreshing the page, or contact support.
      </Box>
    );
  }

  if (step === 0) {
    return (
      <HourlySurveyInstructions
          noApps={data.isEmpty()}
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={nextButtonText}
          isNextButtonDisabled={data.isEmpty()} />
    );
  }

  const isAppSelectionStep = surveyStep === SELECT_CHILD_APPS || surveyStep === SELECT_SHARED_APPS;
  const isSharedAppsResolutionStep = surveyStep === RESOLVE_SHARED_APPS || surveyStep === RESOLVE_OTHER_APPS;

  return (
    <Box>
      <Box mb="20px" fontWeight={500}>
        {getInstructionText()}
      </Box>
      {
        isAppSelectionStep && (
          <SelectAppsByUser
              appsData={surveyStep === SELECT_CHILD_APPS ? data : sharedAppsData}
              selected={surveyStep === SELECT_CHILD_APPS ? childOnlyApps : sharedApps} />
        )
      }

      {
        isSharedAppsResolutionStep && (
          <SelectAppUsageTimeSlots
              data={data}
              initial={surveyStep === RESOLVE_SHARED_APPS}
              initialSelections={surveyStep === RESOLVE_SHARED_APPS ? Map() : initialTimeRangeSelections}
              options={timeRangeOptions}
              selected={surveyStep === RESOLVE_SHARED_APPS ? initialTimeRangeSelections : otherTimeRangeSelections} />
        )
      }
      <SurveyButtons
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={nextButtonText}
          isNextButtonDisabled={data.isEmpty()} />
    </Box>
  );
};

export default HourlySurvey;
