import { Box, Button } from 'lattice-ui-kit';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { TranslationKeys } from '../constants';
import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const SurveyButtons = ({
  isFinalStep,
  isNextButtonDisabled,
  isSubmitting,
  nextButtonText,
  step,
}) => {
  const dispatch = useContext(HourlySurveyDispatch);
  const { t } = useTranslation();

  const handleOnSubmit = () => {
    if (!isFinalStep) {
      dispatch({ type: ACTIONS.NEXT_STEP });
      return;
    }
    dispatch({ type: ACTIONS.SHOW_CONFIRM_MODAL });
  };

  return (
    <Box display="flex" justifyContent="space-between" mt={4}>
      <Button
          disabled={step === 0 || isSubmitting}
          onClick={() => dispatch({ type: ACTIONS.PREV_STEP })}>
        {t(TranslationKeys.BACK)}
      </Button>
      <Button disabled={isNextButtonDisabled} color="primary" onClick={handleOnSubmit} isLoading={isSubmitting}>
        {nextButtonText}
      </Button>
    </Box>
  );
};

export default SurveyButtons;
