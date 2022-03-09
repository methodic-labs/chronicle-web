// @flow
import { useContext } from 'react';

import styled from 'styled-components';
import { faAngleDown, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Menu,
  MenuItem,
  SearchInput
} from 'lattice-ui-kit';

import ParticipantsTableDispatch from './ParticipantsTableDispatch';

import ParticipantsTableActions from '../constants/ParticipantsTableActions';

const {
  TOGGLE_ADD_PARTICIPANT_MODAL,
} = ParticipantsTableActions;

const AddParticipantsButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: 5px;
`;

const BulkActionsButton = styled(Button)`
  margin-left: 10px;
`;

const TableHeader = ({
  handleOnChange,
  selectedParticipants,
  filteredParticipants
} :{
  handleOnChange :(SyntheticInputEvent<HTMLInputElement>) => void;
  selectedParticipants :number;
  filteredParticipants :number;
}) => {
  const dispatch = useContext(ParticipantsTableDispatch);
  const checkBoxLabel = selectedParticipants === 0
    ? `${filteredParticipants} participants`
    : `${selectedParticipants} selected`;

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} item xs={12} sm={6} md={9}>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-start" width="100%">
            <Checkbox
                label={checkBoxLabel} />
            <BulkActionsButton
                endIcon={<FontAwesomeIcon icon={faAngleDown} />}>
              Bulk Actions
            </BulkActionsButton>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <SearchInput placeholder="Filter participants" onChange={handleOnChange} />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AddParticipantsButton
            fullWidth
            onClick={() => dispatch({ type: TOGGLE_ADD_PARTICIPANT_MODAL, isModalOpen: true })}
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}>
          Add Participant
        </AddParticipantsButton>
      </Grid>
    </Grid>
  );
};

export default TableHeader;
