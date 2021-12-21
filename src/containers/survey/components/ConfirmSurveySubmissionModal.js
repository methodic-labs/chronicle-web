// @flow
import { useContext } from 'react';

import {
  Box,
  Modal
} from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const ConfirmSurveySubmissionModal = () => {
  const dispatch = useContext(HourlySurveyDispatch);
  return (
    <Modal
        isVisible
        onClickPrimary={() => dispatch({ type: ACTIONS.CONFIRM_SUBMIT })}
        onClose={() => dispatch({ type: ACTIONS.CANCEL_SUBMIT })}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary="Submit"
        textSecondary="Close"
        textTitle="Confirm Submit">
      <Box maxWidth="500px">
        Are you sure you want to submit survey responses?
      </Box>
    </Modal>
  );
};

export default ConfirmSurveySubmissionModal;
