// @flow
import { Modal } from '../../../../lattice-ui-kit';

type Props = {
  isVisible :boolean;
  onClickPrimary :() => void;
  onClose :() => void;
};

const ConfirmDeleteModal = (props :Props) => {
  const {
    isVisible,
    onClickPrimary,
    onClose
  } = props;
  const message = 'Clicking on "Delete" will delete the selected item.';
  return (
    <Modal
        isVisible={isVisible}
        onClickPrimary={onClickPrimary}
        onClickSecondary={onClose}
        onClose={onClose}
        textPrimary="Delete"
        textSecondary="Cancel"
        textTitle="Confirm Delete">
      <p>{message}</p>
      <p>This action cannot be undone.</p>
    </Modal>
  );
};

export default ConfirmDeleteModal;
