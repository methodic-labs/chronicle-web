// @flow
import { useContext } from 'react';

// $FlowFixMe
import { Box, Modal } from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

import { SURVEY_STEPS } from '../constants';

const CLICK_ON_SUBMIT = 'Click on "submit button once done."';

const {
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
  RESOLVE_SHARED_APPS,
  RESOLVE_OTHER_APPS,
} = SURVEY_STEPS;

const getInstructionItems = (surveyStep) => {
  switch (surveyStep) {
    case SELECT_CHILD_APPS:
      return [
        'Select the apps that were used ONLY by your child',
        CLICK_ON_SUBMIT
      ];
    case SELECT_SHARED_APPS:
      return [
        'Select the apps that were used by BOTH your child and others.',
        CLICK_ON_SUBMIT
      ];
    case RESOLVE_SHARED_APPS:
      return [
        'For the apps used by your child and others, select the time(s) '
          + 'when your child was the primary user (at least 90% of the time)',
        CLICK_ON_SUBMIT
      ];
    case RESOLVE_OTHER_APPS:
      return [
        'For the remaining times, select the times your child used the app '
          + 'at all.',
        CLICK_ON_SUBMIT
      ];
    default:
      return [];
  }
};

type Props = {
  step :number;
  surveyStep :string;
}
const InstructionsModal = (props :Props) => {
  const {
    step,
    surveyStep
  } = props;

  const dispatch = useContext(HourlySurveyDispatch);

  const instructionItems = getInstructionItems(surveyStep);

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
