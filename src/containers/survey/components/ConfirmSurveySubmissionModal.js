import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Modal } from '../../../lattice-ui-kit';
import { TranslationKeys } from '../constants';
import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const ConfirmSurveySubmissionModal = () => {
  const dispatch = useContext(HourlySurveyDispatch);
  const { t } = useTranslation();
  return (
    <Modal
        isVisible
        onClickPrimary={() => dispatch({ type: ACTIONS.CONFIRM_SUBMIT })}
        onClose={() => dispatch({ type: ACTIONS.CANCEL_SUBMIT })}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary={t(TranslationKeys.SUBMIT)}
        textSecondary={t(TranslationKeys.CLOSE)}
        textTitle={t(TranslationKeys.CONFIRM_MODAL_TITLE)}>
      <Box maxWidth="500px">
        {t(TranslationKeys.CONFIRM_MODAL_MESSAGE)}
      </Box>
    </Modal>
  );
};

export default ConfirmSurveySubmissionModal;
