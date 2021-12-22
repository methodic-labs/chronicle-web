// @flow
import { useContext } from 'react';

import { Box, Modal } from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const CLICK_ON_SUBMIT = 'Click on "submit button once done."';

const getInstructionItems = (step) => {
  switch (step) {
    case 1:
      return [
        'Select the apps that were used ONLY by your child',
        CLICK_ON_SUBMIT
      ];
    case 2:
      return [
        'Select the apps that were used by BOTH your child and others.',
        CLICK_ON_SUBMIT
      ];
    case 3:
      return [
        'For the apps used by your child and others, select the time(s) '
          + 'when your child was the primary user (at least 90% of the time)',
        CLICK_ON_SUBMIT
      ];
    default:
      return [
        'For the remaining times, select the times your child used the app '
          + 'at all.',
        CLICK_ON_SUBMIT
      ];
  }
};

type Props = {
  step :number;
}
const InstructionsModal = (props :Props) => {
  const {
    step,
  } = props;

  const dispatch = useContext(HourlySurveyDispatch);

  const instructionItems = getInstructionItems(step);

  return (
    <Modal
        isVisible
        onClose={() => dispatch({ type: ACTIONS.TOGGLE_INSTRUCTIONS_MODAL, visible: false })}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textSecondary="Close"
        textTitle={`Step-${step} Instructions`}>
      <Box maxWidth="500px">
        <ul>
          {
            instructionItems.map((item) => (
              <li key={item}>
                { item }
              </li>
            ))
          }
        </ul>
      </Box>
    </Modal>
  );
};

export default InstructionsModal;
