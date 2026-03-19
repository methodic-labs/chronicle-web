import { useTranslation } from 'react-i18next';

import { Box } from '../../../lattice-ui-kit';
import { TranslationKeys } from '../constants';
import SurveyButtons from './SurveyButtons';

const HourlySurveyInstructions = ({
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
        {t(TranslationKeys.NO_APPS_TODAY)}
      </Box>
    );
  }
  return (
    <Box>
      <Box mb="20px">
        {t(TranslationKeys.INSTRUCTIONS_INTRO)}
      </Box>
      <Box>
        {t(TranslationKeys.INSTRUCTIONS_HELP)}
      </Box>
      <SurveyButtons
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={nextButtonText}
          isNextButtonDisabled={isNextButtonDisabled} />
    </Box>
  );
};

export default HourlySurveyInstructions;
