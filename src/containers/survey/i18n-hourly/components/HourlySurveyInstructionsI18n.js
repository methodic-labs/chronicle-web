import { Box } from 'lattice-ui-kit';
import { useTranslation } from 'react-i18next';

import HourlySurveyTranslationKeys from '../constants/HourlySurveyTranslationKeys';
import SurveyButtonsI18n from './SurveyButtonsI18n';

const HourlySurveyInstructionsI18n = ({
  isFinalStep,
  isNextButtonDisabled,
  isSubmitting,
  nextButtonText,
  noApps,
  step,
}) => {
  const { t } = useTranslation();

  if (noApps) {
    return (
      <Box textAlign="center">
        {t(HourlySurveyTranslationKeys.NO_APPS_TODAY)}
      </Box>
    );
  }
  return (
    <Box>
      <Box mb="20px">
        {t(HourlySurveyTranslationKeys.INSTRUCTIONS_INTRO)}
      </Box>
      <Box>
        {t(HourlySurveyTranslationKeys.INSTRUCTIONS_HELP)}
      </Box>
      <SurveyButtonsI18n
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={nextButtonText}
          isNextButtonDisabled={isNextButtonDisabled} />
    </Box>
  );
};

export default HourlySurveyInstructionsI18n;