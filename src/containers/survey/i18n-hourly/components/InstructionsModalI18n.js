// @flow
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

// $FlowFixMe
import { Box, Modal } from 'lattice-ui-kit';

import { SURVEY_STEPS } from '../../constants';
import HourlySurveyTranslationKeys from '../constants/HourlySurveyTranslationKeys';
import HourlySurveyDispatch, { ACTIONS } from '../../components/HourlySurveyDispatch';

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
        t(HourlySurveyTranslationKeys.SELECT_CHILD_APPS),
        t(HourlySurveyTranslationKeys.NOTE_OPTIONAL)
      ];
    case SELECT_SHARED_APPS:
      return [
        t(HourlySurveyTranslationKeys.SELECT_SHARED_APPS),
        t(HourlySurveyTranslationKeys.NOTE_OPTIONAL)
      ];
    case RESOLVE_SHARED_APPS:
      return [
        t(HourlySurveyTranslationKeys.RESOLVE_SHARED_APPS),
        t(HourlySurveyTranslationKeys.CLICK_SUBMIT)
      ];
    case RESOLVE_OTHER_APPS:
      return [
        t(HourlySurveyTranslationKeys.RESOLVE_OTHER_APPS),
        t(HourlySurveyTranslationKeys.CLICK_SUBMIT)
      ];
    default:
      return [];
  }
};

type Props = {
  step :number;
  surveyStep :string;
}
const InstructionsModalI18n = (props :Props) => {
  const {
    step,
    surveyStep
  } = props;

  const { t } = useTranslation();
  const dispatch = useContext(HourlySurveyDispatch);

  const instructionItems = getInstructionItems(surveyStep, t);

  return (
    <Modal
        isVisible
        onClose={() => dispatch({ type: ACTIONS.TOGGLE_INSTRUCTIONS_MODAL, visible: false })}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textSecondary={t(HourlySurveyTranslationKeys.CLOSE)}
        textTitle={t(HourlySurveyTranslationKeys.INSTRUCTIONS_TITLE, { step })}>
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

export default InstructionsModalI18n;