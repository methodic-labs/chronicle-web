// @flow

import { useContext, useMemo, useState } from 'react';

import styled from 'styled-components';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Set } from 'immutable';
import {
  Checkbox,
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
  SELECT_CANDIDATE_IDS
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

const ParticipantRow = ({
  hasDeletePermission,
  hasDataCollectionModule,
  hasTimeUseDiaryModule,
  participant,
  isSelected,
  stats = {},
} :{
  hasDeletePermission :boolean;
  hasDataCollectionModule :boolean;
  hasTimeUseDiaryModule :boolean;
  isSelected :boolean;
  participant :Participant;
  stats ?:ParticipantStats;
}) => {

  const dispatch = useContext(ParticipantsTableDispatch);
  const [anchorEl, setAnchorEl] = useState(null);

  const candidateId = participant.candidate.id;
  const { participantId } = participant;
  const enrollmentStatus = participant.participationStatus;
  const androidFirstDate = formatDateTime(stats.androidFirstDate || '', DateTime.DATETIME_SHORT);
  const androidLastDate = formatDateTime(stats.androidLastDate || '', DateTime.DATETIME_SHORT);
  const androidUniqueDates = stats.androidUniqueDates?.length;
  let androidUniqueDatesLabel = '---';
  if (androidUniqueDates > 0) {
    androidUniqueDatesLabel = `${androidUniqueDates} ${(androidUniqueDates === 1) ? 'day' : 'days'}`;
  }
  const tudFirstDate = formatDateTime(stats.tudFirstDate || '', DateTime.DATETIME_SHORT);
  const tudLastDate = formatDateTime(stats.tudLastDate || '', DateTime.DATETIME_SHORT);
  const tudUniqueDates = stats.tudUniqueDates?.length;
  let tudUniqueDatesLabel = '---';
  if (tudUniqueDates > 0) {
    tudUniqueDatesLabel = `${tudUniqueDates} ${(tudUniqueDates === 1) ? 'day' : 'days'}`;
  }

  const getRowData = () => {
    const tudData = [tudFirstDate, tudLastDate, tudUniqueDatesLabel];
    const androidData = [androidFirstDate, androidLastDate, androidUniqueDatesLabel];

    if (hasDataCollectionModule && hasTimeUseDiaryModule) {
      return [participantId, ...androidData, ...tudData];
    }
    if (hasDataCollectionModule) {
      return [participantId, ...androidData];
    }
    if (hasTimeUseDiaryModule) {
      return [participantId, ...tudData];
    }

    // TODO: Need to update this later for ios sensor

    return [participantId];
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
        <td>
          <Checkbox
              onChange={() => dispatch({ type: SELECT_CANDIDATE_IDS, ids: Set([candidateId]) })}
              checked={isSelected} />
        </td>
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
              hasTimeUseDiaryModule && (
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
