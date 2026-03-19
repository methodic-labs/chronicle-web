import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Modal } from '../../../lattice-ui-kit';
import { TranslationKeys } from '../constants';

const ModalBody = styled.div`
  max-width: 400px;
`;

const SubmissionFailureModal = ({ handleOnClose, isVisible }) => {
  const { t } = useTranslation();
  // TODO - translate modal title
  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        textSecondary="Close"
        textTitle="Submission Failure">
      <ModalBody>
        <p>{t(TranslationKeys.ERROR_SUBMIT)}</p>
      </ModalBody>
    </Modal>
  );
};

export default SubmissionFailureModal;
