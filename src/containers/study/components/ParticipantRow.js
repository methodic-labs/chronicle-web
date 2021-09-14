// @flow

import React, { useContext } from 'react';

import styled from 'styled-components';
import {
  faCloudDownload,
  faLink,
  faToggleOff,
  faToggleOn,
  faTrashAlt
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIn } from 'immutable';
import { Colors, IconButton } from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import ParticipantsTableDispatch from './ParticipantsTableDispatch';

import EnrollmentStatuses from '../../../utils/constants/EnrollmentStatus';
import ParticipantsTableActions from '../constants/ParticipantsTableActions';
import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';

const { formatDateTime } = DateTimeUtils;

const {
  DATETIME_START_FQN,
  DATETIME_END_FQN,
  EVENT_COUNT,
  PERSON_ID,
  STATUS,
} = PROPERTY_TYPE_FQNS;
const { NEUTRAL, PURPLE } = Colors;

const { ENROLLED } = EnrollmentStatuses;

const {
  SET_PARTICIPANT_EKID,
  TOGGLE_DELETE_MODAL,
  TOGGLE_DOWNLOAD_MODAL,
  TOGGLE_ENROLLMENT_MODAL,
  TOGGLE_INFO_MODAL,
} = ParticipantsTableActions;

const StyledCell = styled.td`
  padding: 10px 5px;
  word-wrap: break-word;
`;

const RowWrapper = styled.tr.attrs(() => ({ tabIndex: '1' }))`
  border-bottom: 1px solid ${NEUTRAL.N100};

  :focus {
    outline: none;
  }
`;

const CellContent = styled.div`
  display: flex;
  font-size: 15px;
  overflow: hidden;
  padding: 0 5px;
  color: ${NEUTRAL.N800};
  justify-content: ${(props) => (props.centerContent ? 'center' : 'flex-start')};
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  :hover {
    cursor: pointer;
  }
`;

const ActionIconsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type IconProps = {
  action :string;
  enrollmentStatus :string;
  hasDeletePermission :Boolean;
  icon :any;
  participantEntityKeyId :UUID;
};

const ActionIcon = (props :IconProps) => {
  const {
    action,
    enrollmentStatus,
    hasDeletePermission,
    icon,
    participantEntityKeyId,
  } = props;

  const dispatch = useContext(ParticipantsTableDispatch);

  let iconColor = NEUTRAL.N800;
  if (icon === faToggleOn && enrollmentStatus === ENROLLED) {
    // eslint-disable-next-line prefer-destructuring
    iconColor = PURPLE.P300;
  }
  if (icon === faTrashAlt && !hasDeletePermission) {
    iconColor = NEUTRAL.N300;
  }

  const handleClick = () => {
    dispatch({ type: SET_PARTICIPANT_EKID, participantEntityKeyId });
    dispatch({ type: action, isModalOpen: true });
  };

  return (
    <IconButton
        disabled={action === TOGGLE_DELETE_MODAL && !hasDeletePermission}
        onClick={handleClick}>
      <StyledFontAwesomeIcon
          color={iconColor}
          icon={icon} />
    </IconButton>
  );
};

type Props = {
  data :Object;
  hasDeletePermission :Boolean;
};

const ParticipantRow = (props :Props) => {
  const { data, hasDeletePermission } = props;

  const participantEntityKeyId = getIn(data, ['id', 0]);
  const participantId = getIn(data, [PERSON_ID, 0]);
  const enrollmentStatus = getIn(data, [STATUS, 0]);
  const firstDataDate = formatDateTime(getIn(data, [DATETIME_START_FQN, 0]), DateTime.DATETIME_SHORT);
  const lastDataDate = formatDateTime(getIn(data, [DATETIME_END_FQN, 0]), DateTime.DATETIME_SHORT);
  const numDays = getIn(data, [EVENT_COUNT, 0]);

  const toggleIcon = enrollmentStatus === ENROLLED ? faToggleOn : faToggleOff;
  const actionsData = [
    { action: TOGGLE_INFO_MODAL, icon: faLink },
    { action: TOGGLE_DOWNLOAD_MODAL, icon: faCloudDownload },
    { action: TOGGLE_DELETE_MODAL, icon: faTrashAlt },
    { action: TOGGLE_ENROLLMENT_MODAL, icon: toggleIcon },
  ];

  return (
    <>
      <RowWrapper onClick={() => {}}>
        <StyledCell>
          <CellContent>
            { participantId }
          </CellContent>
        </StyledCell>

        <StyledCell>
          <CellContent>
            { firstDataDate }
          </CellContent>
        </StyledCell>

        <StyledCell>
          <CellContent>
            { lastDataDate }
          </CellContent>
        </StyledCell>

        <StyledCell>
          <CellContent centerContent>
            { numDays }
          </CellContent>
        </StyledCell>

        <StyledCell>
          <ActionIconsWrapper>
            {
              actionsData.map((actionItem) => (
                <ActionIcon
                    action={actionItem.action}
                    enrollmentStatus={enrollmentStatus}
                    hasDeletePermission={hasDeletePermission}
                    icon={actionItem.icon}
                    key={actionItem.action}
                    participantEntityKeyId={participantEntityKeyId} />
              ))
            }
          </ActionIconsWrapper>
        </StyledCell>
      </RowWrapper>
    </>
  );
};

export default ParticipantRow;
