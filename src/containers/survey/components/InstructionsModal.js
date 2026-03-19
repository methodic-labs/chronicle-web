import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Modal } from '../../../lattice-ui-kit';
import { SURVEY_STEPS, TranslationKeys } from '../constants';
import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const {
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
  RESOLVE_SHARED_APPS,
  RESOLVE_OTHER_APPS,
} = SURVEY_STEPS;

const getInstructionItems = (surveyStep, t) => {
  switch (surveyStep) {
    case SELECT_CHILD_APPS:
      return [
        t(TranslationKeys.INSTRUCTIONS_SELECT_CHILD_APPS),
        t(TranslationKeys.INSTRUCTIONS_NOTE_OPTIONAL)
      ];
    case SELECT_SHARED_APPS:
      return [
        t(TranslationKeys.INSTRUCTIONS_SELECT_SHARED_APPS),
        t(TranslationKeys.INSTRUCTIONS_NOTE_OPTIONAL)
      ];
    case RESOLVE_SHARED_APPS:
      return [
        t(TranslationKeys.INSTRUCTIONS_RESOLVE_SHARED_APPS),
        t(TranslationKeys.INSTRUCTIONS_CLICK_SUBMIT)
      ];
    case RESOLVE_OTHER_APPS:
      return [
        t(TranslationKeys.INSTRUCTIONS_RESOLVE_OTHER_APPS),
        t(TranslationKeys.INSTRUCTIONS_CLICK_SUBMIT)
      ];
    default:
      return [];
  }
};

const InstructionsModal = ({ step, surveyStep }) => {
  const { t } = useTranslation();
  const dispatch = useContext(HourlySurveyDispatch);
  const instructionItems = getInstructionItems(surveyStep, t);
  return (
    <Modal
        isVisible
        onClose={() => dispatch({ type: ACTIONS.TOGGLE_INSTRUCTIONS_MODAL, visible: false })}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textSecondary={t(TranslationKeys.CLOSE)}
        textTitle={t(TranslationKeys.INSTRUCTIONS_TITLE, { step })}>
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
