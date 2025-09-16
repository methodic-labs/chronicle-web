// @flow

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import {
  Colors,
} from 'lattice-ui-kit';

import HourlySurveyTranslationKeys from '../constants/HourlySurveyTranslationKeys';

const { NEUTRAL, GREEN } = Colors;
const Wrapper = styled.div`
  align-items: center;
  color: ${NEUTRAL.N900};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 0;
  text-align: center;

  > h3 {
    font-size: 18px;
    font-weight: 500;
    margin: 5px 0;
    padding: 0;
  }

  > p {
    color: ${NEUTRAL.N800};
    font-size: 15px;
    font-weight: 400;
    margin: 0;
    padding: 0;
  }
`;
const SubmissionSuccessfulI18n = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <FontAwesomeIcon color={GREEN.G300} icon={faCircleCheck} size="3x" />
      <h3>{t(HourlySurveyTranslationKeys.SUCCESS_TITLE)}</h3>
      <p>{t(HourlySurveyTranslationKeys.SUCCESS_MESSAGE)}</p>
    </Wrapper>
  );
};

export default SubmissionSuccessfulI18n;