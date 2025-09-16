// @flow
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  // $FlowFixMe
  Box,
  Modal
} from 'lattice-ui-kit';

import HourlySurveyTranslationKeys from '../constants/HourlySurveyTranslationKeys';
import HourlySurveyDispatch, { ACTIONS } from '../../components/HourlySurveyDispatch';

const ConfirmSurveySubmissionModalI18n = () => {
  const { t } = useTranslation();
  const dispatch = useContext(HourlySurveyDispatch);
  return (
    <Modal
        isVisible
        onClickPrimary={() => dispatch({ type: ACTIONS.CONFIRM_SUBMIT })}
        onClose={() => dispatch({ type: ACTIONS.CANCEL_SUBMIT })}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary={t(HourlySurveyTranslationKeys.CONFIRM_MODAL_SUBMIT)}
        textSecondary={t(HourlySurveyTranslationKeys.CONFIRM_MODAL_CLOSE)}
        textTitle={t(HourlySurveyTranslationKeys.CONFIRM_MODAL_TITLE)}>
      <Box maxWidth="500px">
        {t(HourlySurveyTranslationKeys.CONFIRM_MODAL_MESSAGE)}
      </Box>
    </Modal>
  );
};

export default ConfirmSurveySubmissionModalI18n;