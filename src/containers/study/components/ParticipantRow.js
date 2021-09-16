// @flow

import React, { useContext, useState } from 'react';

import styled from 'styled-components';
import {
  faCloudDownload,
  faEllipsisV,
  faLink,
  faToggleOff,
  faToggleOn,
  faTrashAlt,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIn } from 'immutable';
import {
  Colors,
  IconButton,
  Menu,
  MenuItem
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import ParticipantsTableDispatch from './ParticipantsTableDispatch';

import EnrollmentStatuses from '../../../utils/constants/EnrollmentStatus';
import ParticipantsTableActions from '../constants/ParticipantsTableActions';
import { COLUMN_FIELDS } from '../constants/tableColumns';

const { formatDateTime } = DateTimeUtils;

const {
  ANDROID_DATA_DURATION,
  ENROLLMENT_STATUS,
  FIRST_ANDROID_DATA,
  FIRST_TUD_SUBMISSION,
  LAST_ANDROID_DATA,
  LAST_TUD_SUBMISSION,
  PARTICIPANT_ID,
  TUD_SUBMISSION_DURATION,
} = COLUMN_FIELDS;

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
  padding: 10px;
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  // todo: handle when menu items are selected
  // pause/resume only available if data collection
  // columns to display:
      // only data collection
      // only survey
      // all columns
      // prop: isSurveyModuleInstalled
      // prop: isDataCollectionModuleInstalled

  const participantEKId = getIn(data, ['id', 0]);
  const participantId = getIn(data, [PARTICIPANT_ID, 0]);
  const enrollmentStatus = getIn(data, [ENROLLMENT_STATUS, 0]);
  const firstAndroidData = formatDateTime(getIn(data, [FIRST_ANDROID_DATA, 0]), DateTime.DATETIME_SHORT);
  const lastAndroidData = formatDateTime(getIn(data, [LAST_ANDROID_DATA, 0]), DateTime.DATETIME_SHORT);
  const androidDataDuration = getIn(data, [ANDROID_DATA_DURATION, 0]);
  const firstTudSubmission = formatDateTime(getIn(data, [FIRST_TUD_SUBMISSION, 0]), DateTime.DATETIME_SHORT);
  const lastTudSubmission = formatDateTime(getIn(data, [LAST_TUD_SUBMISSION, 0]), DateTime.DATETIME_SHORT);
  const tudSubmissionDuration = getIn(data, [TUD_SUBMISSION_DURATION, 0]);

  const toggleIcon = enrollmentStatus === ENROLLED ? faToggleOn : faToggleOff;
  const actionsData = [
    { action: LINK, icon: faEllipsisV },
    { action: DOWNLOAD, icon: faCloudDownload },
    { action: DELETE, icon: faTrashAlt },
    { action: TOGGLE_ENROLLMENT, icon: toggleIcon },
  ];
  const pauseOrResume = enrollmentStatus === ENROLLED ? 'Pause Enrollment' : 'Resume Enrollment';

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <RowWrapper onClick={() => {}}>
        {
          [participantId,
            firstAndroidData,
            lastAndroidData,
            androidDataDuration,
            firstTudSubmission,
            lastTudSubmission,
            tudSubmissionDuration
          ].map((item, index) => (
            <StyledCell key={index}>
              <CellContent>
                { item }
              </CellContent>
            </StyledCell>
          ))
        }
        <StyledCell>
          <CellContent>
            <IconButton
                aria-controls="table_actions_menu"
                aria-haspopup="true"
                onClick={handleOnClick}>
              <StyledFontAwesomeIcon
                  color={NEUTRAL.N800}
                  icon={faEllipsisV} />
            </IconButton>
            <Menu
                id="table_actions_menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleOnClose}>
              <MenuItem>
                Participant Info
              </MenuItem>
              <MenuItem
                  disabled={!hasDeletePermission}>
                Delete
              </MenuItem>
              <MenuItem>
                Download Data
              </MenuItem>
              <MenuItem>
                { pauseOrResume }
              </MenuItem>
              <MenuItem>
                TUD Submission Dates
              </MenuItem>
            </Menu>
          </CellContent>
        </StyledCell>
      </RowWrapper>
    </>
  );
};
/* eslint-enable */

export default ParticipantRow;
