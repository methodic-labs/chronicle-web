/*
 * @flow
 */

import { useReducer, useRef } from 'react';

import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  IconButton,
  Menu,
  MenuItem,
} from 'lattice-ui-kit';

import AddParticipantModal from './AddParticipantModal';

import SendMessagesModal from '../../message/components/SendMessagesModal';

const CLOSE_ADD_PARTICIPANT = 'CLOSE_ADD_PARTICIPANT';
const CLOSE_MENU = 'CLOSE_MENU';
const CLOSE_SEND_ENROLLMENT = 'CLOSE_SEND_ENROLLMENT';
const OPEN_ADD_PARTICIPANT = 'OPEN_ADD_PARTICIPANT';
const OPEN_MENU = 'OPEN_MENU';
const OPEN_SEND_ENROLLMENT = 'OPEN_SEND_ENROLLMENT';

const INITIAL_STATE :{
  addParticipantOpen :boolean;
  menuOpen :boolean;
  sendEnrollmentOpen :boolean;
} = {
  addParticipantOpen: false,
  menuOpen: false,
  sendEnrollmentOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case CLOSE_MENU:
      return {
        ...state,
        menuOpen: false,
      };
    case OPEN_MENU:
      return {
        ...state,
        menuOpen: true,
      };
    case CLOSE_ADD_PARTICIPANT:
      return {
        ...state,
        addParticipantOpen: false,
      };
    case OPEN_ADD_PARTICIPANT:
      return {
        ...state,
        addParticipantOpen: true,
        menuOpen: false,
      };
    case CLOSE_SEND_ENROLLMENT:
      return {
        ...state,
        sendEnrollmentOpen: false,
      };
    case OPEN_SEND_ENROLLMENT:
      return {
        ...state,
        sendEnrollmentOpen: true,
        menuOpen: false,
      };
    default:
      return state;
  }
};

const ParticipantsActionButton = ({
  study,
  participants,
} :{|
  study :Map;
  participants :Map;
|}) => {

  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);

  const anchorRef = useRef(null);

  const handleOpenMenu = () => {
    stateDispatch({ type: OPEN_MENU });
  };

  const handleCloseMenu = () => {
    stateDispatch({ type: CLOSE_MENU });
  };

  const handleOpenAddParticipant = () => {
    stateDispatch({ type: OPEN_ADD_PARTICIPANT });
  };

  const handleCloseAddParticipant = () => {
    stateDispatch({ type: CLOSE_ADD_PARTICIPANT });
  };

  const handleOpenSendEnrollment = () => {
    stateDispatch({ type: OPEN_SEND_ENROLLMENT });
  };

  const handleCloseSendEnrollment = () => {
    stateDispatch({ type: CLOSE_SEND_ENROLLMENT });
  };

  return (
    <>
      <IconButton
          aria-controls={state.menuOpen ? 'participants-action-menu' : undefined}
          aria-expanded={state.menuOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="participants action button"
          onClick={handleOpenMenu}
          ref={anchorRef}
          variant="text">
        <FontAwesomeIcon fixedWidth icon={faEllipsisV} />
      </IconButton>
      <Menu
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom',
          }}
          elevation={4}
          getContentAnchorEl={null}
          id="participants-action-menu"
          onClose={handleCloseMenu}
          open={state.menuOpen}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}>
        <MenuItem onClick={handleOpenAddParticipant}>
          Add Participant
        </MenuItem>
        <MenuItem onClick={handleOpenSendEnrollment}>
          Send SMS Messages
        </MenuItem>
      </Menu>
      <AddParticipantModal
          isVisible={state.addParticipantOpen}
          onCloseModal={handleCloseAddParticipant}
          participants={participants}
          study={study} />
      <SendMessagesModal
          isVisible={state.sendEnrollmentOpen}
          onClose={handleCloseSendEnrollment}
          participants={participants}
          study={study} />
    </>
  );
};

export default ParticipantsActionButton;
