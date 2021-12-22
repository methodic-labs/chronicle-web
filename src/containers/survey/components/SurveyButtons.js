// @flow
import { useContext } from 'react';

// $FlowFixMe
import { Box, Button } from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

type Props ={
  isFinalStep :boolean;
  isNextButtonDisabled :boolean;
  isSubmitting :boolean;
  nextButtonText :string;
  step :number;
}
const SurveyButtons = (props :Props) => {
  const {
    isFinalStep,
    isNextButtonDisabled,
    isSubmitting,
    nextButtonText,
    step,
  } = props;

  const dispatch = useContext(HourlySurveyDispatch);

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
        Back
      </Button>
      <Button disabled={isNextButtonDisabled} color="primary" onClick={handleOnSubmit} isLoading={isSubmitting}>
        {nextButtonText}
      </Button>
    </Box>
  );
};

export default SurveyButtons;
