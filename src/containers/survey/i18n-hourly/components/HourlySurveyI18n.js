import { Map } from 'immutable';
import { Box } from 'lattice-ui-kit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SURVEY_STEPS } from '../../constants';
import HourlySurveyTranslationKeys from '../constants/HourlySurveyTranslationKeys';
import HourlySurveyInstructionsI18n from './HourlySurveyInstructionsI18n';
import SelectAppUsageTimeSlots from '../../components/SelectAppUsageTimeSlots';
import SelectAppsByUser from '../../components/SelectAppsByUser';
import SurveyButtonsI18n from './SurveyButtonsI18n';

const {
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
  RESOLVE_SHARED_APPS,
  RESOLVE_OTHER_APPS,
  INTRO
} = SURVEY_STEPS;

const HourlySurveyI18n = ({
  data,
  isSubmitting,
  state,
}) => {

  const { t } = useTranslation();
  const childOnlyApps = state.get('childOnlyApps');
  const initialTimeRangeSelections = state.get('initialTimeRangeSelections');
  const isFinalStep = state.get('isFinalStep');
  const otherTimeRangeSelections = state.get('otherTimeRangeSelections');
  const sharedApps = state.get('sharedApps');
  const step = state.get('step');
  const surveyStep = state.get('surveyStep');

  const getInstructionText = () => {
    switch (surveyStep) {
      case SELECT_CHILD_APPS:
        return t(HourlySurveyTranslationKeys.SELECT_CHILD_APPS);
      case SELECT_SHARED_APPS:
        return t(HourlySurveyTranslationKeys.SELECT_SHARED_APPS);
      case RESOLVE_SHARED_APPS:
        return t(HourlySurveyTranslationKeys.RESOLVE_SHARED_APPS);
      case RESOLVE_OTHER_APPS:
        return t(HourlySurveyTranslationKeys.RESOLVE_OTHER_APPS);
      default:
        return '';
    }
  };

  const nextButtonText = useMemo(() => {
    if (isFinalStep) return t(HourlySurveyTranslationKeys.SUBMIT);
    if (surveyStep === INTRO) return t(HourlySurveyTranslationKeys.BEGIN_SURVEY);
    return t(HourlySurveyTranslationKeys.NEXT);
  }, [isFinalStep, surveyStep, t]);

  const sharedAppsData = data.filterNot((val, key) => childOnlyApps.has(key));
  const timeRangeOptions = data.filter((val, key) => sharedApps.has(key));

  if (step === 0) {
    return (
      <HourlySurveyInstructionsI18n
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
      <SurveyButtonsI18n
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={nextButtonText}
          isNextButtonDisabled={data.isEmpty()} />
    </Box>
  );
};

export default HourlySurveyI18n;