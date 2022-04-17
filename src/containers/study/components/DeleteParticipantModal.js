// @flow

import {
  Box,
  Modal,
  ModalFooter,
  Typography,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

const {
  isFailure,
  isPending,
  isStandby,
  isSuccess,
} = ReduxUtils;

const DeleteParticipantModal = ({
  handleOnClose,
  handleOnDeleteParticipant,
  isVisible,
  participantId,
  requestState,
} :{
  handleOnClose :() => void;
  handleOnDeleteParticipant :() => void;
  isVisible :boolean;
  participantId :UUID;
  requestState :?RequestState;
}) => {

  const textPrimary = 'Delete';
  const textSecondary = 'Cancel';

  const renderFooter = () => {
    if (requestState === RequestStates.PENDING) {
      return (
        <ModalFooter
            isPendingPrimary
            onClickSecondary={handleOnClose}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            withFooter />
      );
    }
    if (requestState === RequestStates.SUCCESS || requestState === RequestStates.FAILURE) {
      return (
        <ModalFooter
            onClickPrimary={handleOnClose}
            textPrimary="Close"
            textSecondary="" />
      );
    }
    return (
      <ModalFooter
          onClickPrimary={handleOnDeleteParticipant}
          onClickSecondary={handleOnClose}
          textPrimary={textPrimary}
          textSecondary={textSecondary} />
    );
  };

  const areYouSure = (
    `Are you sure you want to delete ${participantId}'s data? This action is permanent and cannot be undone.`
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        requestState={requestState}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        textTitle="Delete Participant's Data"
        withFooter={renderFooter}>
      <Box maxWidth="500px">
        {
          (isStandby(requestState) || isPending(requestState)) && (
            <Typography>
              {areYouSure}
            </Typography>
          )
        }
        {
          isSuccess(requestState) && (
            <Typography>
              Your request to delete participant&apos;s data has been successfully submitted.
            </Typography>
          )
        }
        {
          isFailure(requestState) && (
            <Typography>
              Failed to delete participant. Please try again or contact support@openlattice.com.
            </Typography>
          )
        }
      </Box>
    </Modal>
  );
};

export default DeleteParticipantModal;
