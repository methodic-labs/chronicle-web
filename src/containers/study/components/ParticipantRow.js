// @flow

import { useContext, useMemo, useState } from 'react';

import styled from 'styled-components';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Colors,
  IconButton,
  Menu,
  MenuItem,
  Tag
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import ParticipantsTableDispatch from './ParticipantsTableDispatch';

import EnrollmentStatuses from '../../../utils/constants/EnrollmentStatus';
import ParticipantsTableActions from '../constants/ParticipantsTableActions';
import type { Participant, ParticipantStats } from '../../../common/types';

const { formatDateTime } = DateTimeUtils;

const { NEUTRAL } = Colors;

const { ENROLLED } = EnrollmentStatuses;

const {
  SET_CANDIDATE_ID,
  TOGGLE_DELETE_MODAL,
  TOGGLE_DOWNLOAD_MODAL,
  TOGGLE_ENROLLMENT_MODAL,
  TOGGLE_INFO_MODAL,
  // SELECT_CANDIDATE_IDS
} = ParticipantsTableActions;

const RowWrapper = styled.tr.attrs(() => ({ tabIndex: '1' }))`
  border-bottom: 1px solid ${NEUTRAL.N100};

  :focus {
    outline: none;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  :hover {
    cursor: pointer;
  }
`;

const StyledTag = styled(Tag)`
  margin-left: 0;
`;

const getColumnDateValue = (date) => formatDateTime(date || '', DateTime.DATETIME_SHORT);

const getUniqueDaysLabel = (days = 0) => {
  if (days === 0) return '---';
  return days === 1 ? `${days} day` : `${days} days`;
};

const ParticipantRow = ({
  hasAndroidDataCollection,
  hasDeletePermission,
  hasTimeUseDiary,
  hasIOSSensorDataCollection,
  // isSelected,
  participant,
  stats = {},
} :{
  hasAndroidDataCollection :boolean;
  hasDeletePermission :boolean;
  hasTimeUseDiary :boolean;
  hasIOSSensorDataCollection :boolean;
  // isSelected :boolean;
  participant :Participant;
  stats ?:ParticipantStats;
}) => {

  const dispatch = useContext(ParticipantsTableDispatch);
  const [anchorEl, setAnchorEl] = useState(null);

  const candidateId = participant.candidate.id;
  const { participantId } = participant;
  const enrollmentStatus = participant.participationStatus;

  const getRowData = () => {
    const tudData = [
      getColumnDateValue(stats.tudFirstDate),
      getColumnDateValue(stats.tudLastDate),
      getUniqueDaysLabel(stats.tudUniqueDates?.length)
    ];
    const androidData = [
      getColumnDateValue(stats.androidFirstDate),
      getColumnDateValue(stats.androidLastDate),
      getUniqueDaysLabel(stats.androidUniqueDates?.length)
    ];

    const iosSensorData = [
      getColumnDateValue(stats.iosFirstDate),
      getColumnDateValue(stats.iosLastDate),
      getUniqueDaysLabel(stats.iosUniqueDates?.length)
    ];

    let result = [participantId];
    if (hasAndroidDataCollection) {
      result = [...result, ...androidData];
    }
    if (hasIOSSensorDataCollection) {
      result = [...result, ...iosSensorData];
    }

    if (hasTimeUseDiary) {
      result = [...result, ...tudData];
    }

    return result;
  };

  const rowData = useMemo(() => getRowData(), [candidateId]);

  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event) => {
    const { currentTarget } = event;
    const { dataset } = currentTarget;
    const { actionId } = dataset;

    setAnchorEl(null);

    dispatch({ type: SET_CANDIDATE_ID, candidateId });
    dispatch({ type: actionId, isModalOpen: true });
  };

  const pauseOrResume = enrollmentStatus === ENROLLED ? 'Pause Enrollment' : 'Resume Enrollment';

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <RowWrapper onClick={() => {}}>
        {/* <td>
          <Checkbox
              onChange={() => dispatch({ type: SELECT_CANDIDATE_IDS, ids: Set([candidateId]) })}
              checked={isSelected} />
        </td> */}
        {
          rowData.map((item, index) => (
            <td key={index}>
              { item }
            </td>
          ))
        }
        <td>
          <StyledTag mode={enrollmentStatus === ENROLLED ? 'primary' : 'default'}>
            { enrollmentStatus }
          </StyledTag>
        </td>
        <td>
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
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
              getContentAnchorEl={null}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              open={Boolean(anchorEl)}
              onClose={handleOnClose}>
            <MenuItem
                data-action-id={TOGGLE_INFO_MODAL}
                onClick={handleMenuItemClick}>
              Participant Info
            </MenuItem>
            <MenuItem
                data-action-id={TOGGLE_DELETE_MODAL}
                disabled={!hasDeletePermission}
                onClick={handleMenuItemClick}>
              Delete
            </MenuItem>
            <MenuItem
                data-action-id={TOGGLE_DOWNLOAD_MODAL}
                onClick={handleMenuItemClick}>
              Download Data
            </MenuItem>
            <MenuItem
                data-action-id={TOGGLE_ENROLLMENT_MODAL}
                onClick={handleMenuItemClick}>
              { pauseOrResume }
            </MenuItem>
            {/* {
              hasTimeUseDiary && (
                <MenuItem
                    data-action-id={TOGGLE_TUD_SUBMISSION_HISTORY_MODAL}
                    onClick={handleMenuItemClick}>
                  TUD Submission Dates
                </MenuItem>
              )
            } */}
          </Menu>
        </td>
      </RowWrapper>
    </>
  );
};
/* eslint-enable */

ParticipantRow.defaultProps = {
  stats: {},
};

export default ParticipantRow;
