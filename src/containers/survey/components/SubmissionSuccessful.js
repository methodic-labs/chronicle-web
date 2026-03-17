import { Colors } from 'lattice-ui-kit';
import { CircleCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { TranslationKeys } from '../constants';

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

const SubmissionSuccessful = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <CircleCheckIcon size={32} stroke={GREEN.G300} />
      <h3>{t(TranslationKeys.SUBMISSION_SUCCESSFUL)}</h3>
      <p>{t(TranslationKeys.THANK_YOU_FOR_PARTICIPATING)}</p>
    </Wrapper>
  );
};

export default SubmissionSuccessful;
