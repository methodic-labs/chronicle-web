// @flow

import { useState } from 'react';

import {
  Box,
  Input,
  Label,
  Modal,
  Spinner,
  Typography,
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { STUDY_ID } from '../../../common/constants';
import { deleteStudy } from '../actions';
import type { Study } from '../../../common/types';

const DeleteStudyModal = ({
  isVisible,
  onClose,
  requestState,
  study
} :{|
  isVisible :boolean;
  onClose :() => void;
  requestState :RequestState;
  study :Study
|}) => {
  const dispatch = useDispatch();

  const [studyTitle, setStudyName] = useState('');
  const [isInputError, setInputError] = useState(false);

  const handleOnChange = (event :SyntheticInputEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    const { value } = currentTarget;
    setStudyName(value);
  };

  const handleOnDelete = () => {
    if (studyTitle === study.title) {
      setInputError(false);
      dispatch(deleteStudy({
        [STUDY_ID]: study.id
      }));
    }
    else {
      setInputError(true);
    }
  };

  const requestStateComponents = {
    [RequestStates.STANDBY]: (
      <div>
        <Typography gutterBottom>
          Are you sure you want to delete study?
        </Typography>

        <Label htmlFor="studyTitle">
          To confirm, please type the name of study.
        </Label>
        <Input
            error={isInputError}
            id="studyTitle"
            onChange={handleOnChange}
            value={studyTitle} />
      </div>
    ),
    [RequestStates.FAILURE]: (
      <Typography>
        Sorry, could not delete study. Please try again or contact support@openlattice.com.
      </Typography>
    ),
    [RequestStates.PENDING]: (
      <Box textAlign="center">
        <Spinner size="2x" />
        <Typography>
          Deleting study. Please wait.
        </Typography>
      </Box>
    ),
    [RequestStates.SUCCESS]: (
      <Typography>
        Your request to delete study has been successfully submitted.
      </Typography>
    )
  };

  const textPrimary = requestState === RequestStates.PENDING || requestState === RequestStates.STANDBY ? 'Delete' : '';

  return (
    <Modal
        isVisible={isVisible}
        onClickPrimary={handleOnDelete}
        onClose={onClose}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary={textPrimary}
        textSecondary="Close"
        textTitle="Delete Study">
      <Box maxWidth="500px">
        { requestStateComponents[requestState] }
      </Box>
    </Modal>
  );
};

export default DeleteStudyModal;
