import { Box } from 'lattice-ui-kit';

import SurveyButtons from './SurveyButtons';

const HourlySurveyInstructions = ({
  isFinalStep,
  isNextButtonDisabled,
  isSubmitting,
  nextButtonText,
  noApps,
  step,
}) => {
  if (noApps) {
    return (
      <Box textAlign="center">
        There is no recorded app usage without a known user today.
        Thank you for your participation, the survey is not needed today.
      </Box>
    );
  }
  return (
    <Box>
      <Box mb="20px">
        Please complete this short survey to let us know which of the apps
        used on the selected date were used by the child enrolled in our study.
        The survey will refer to this child as &quot;your child&quot;.
      </Box>
      <Box>
        For instructions at each step please click on 3 dots to the top-right of the app.
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
