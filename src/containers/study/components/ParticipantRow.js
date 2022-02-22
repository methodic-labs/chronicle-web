// @flow

import { useContext, useMemo, useState } from 'react';

import styled from 'styled-components';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIn } from 'immutable';
import {
  Colors,
  IconButton,
  // $FlowFixMe
  Menu,
  // $FlowFixMe
  MenuItem,
  Tag,
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

const { NEUTRAL } = Colors;

const { ENROLLED } = EnrollmentStatuses;

const {
  SET_PARTICIPANT_EKID,
  TOGGLE_DELETE_MODAL,
  TOGGLE_DOWNLOAD_MODAL,
  TOGGLE_ENROLLMENT_MODAL,
  TOGGLE_INFO_MODAL,
  TOGGLE_TUD_SUBMISSION_HISTORY_MODAL
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
  color: ${NEUTRAL.N800};
  justify-content: ${(props) => (props.centerContent ? 'center' : 'flex-start')};
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  :hover {
    cursor: pointer;
  }
`;

type Props = {
  orgHasSurveyModule :boolean;
  orgHasDataCollectionModule :boolean;
  data :Object;
  hasDeletePermission :boolean;
};

const ParticipantRow = (props :Props) => {
  const {
    orgHasSurveyModule,
    data,
    orgHasDataCollectionModule,
    hasDeletePermission
  } = props;

  const dispatch = useContext(ParticipantsTableDispatch);
  const [anchorEl, setAnchorEl] = useState(null);

  const participantEntityKeyId = getIn(data, ['id', 0]);
  const participantId = getIn(data, [PARTICIPANT_ID, 0]);
  const enrollmentStatus = getIn(data, [ENROLLMENT_STATUS, 0]);
  const firstAndroidData = formatDateTime(getIn(data, [FIRST_ANDROID_DATA, 0]), DateTime.DATETIME_SHORT);
  const lastAndroidData = formatDateTime(getIn(data, [LAST_ANDROID_DATA, 0]), DateTime.DATETIME_SHORT);
  const androidDataDuration = getIn(data, [ANDROID_DATA_DURATION, 0]);
  const firstTudSubmission = formatDateTime(getIn(data, [FIRST_TUD_SUBMISSION, 0]), DateTime.DATETIME_SHORT);
  const lastTudSubmission = formatDateTime(getIn(data, [LAST_TUD_SUBMISSION, 0]), DateTime.DATETIME_SHORT);
  const tudSubmissionDuration = getIn(data, [TUD_SUBMISSION_DURATION, 0]);

  const getRowData = () => {
    const tudData = [firstTudSubmission, lastTudSubmission, tudSubmissionDuration];
    const androidData = [firstAndroidData, lastAndroidData, androidDataDuration];
    if (orgHasDataCollectionModule && orgHasSurveyModule) {
      return [participantId, ...androidData, ...tudData];
    }
    if (orgHasDataCollectionModule) {
      return [participantId, ...androidData];
    }
    if (orgHasSurveyModule) {
      return [participantId, ...tudData];
    }

    return [participantId, ...androidData, ...tudData];
  };

  const rowData = useMemo(() => getRowData(), [participantEntityKeyId]);

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

    dispatch({ type: SET_PARTICIPANT_EKID, participantEntityKeyId });
    dispatch({ type: actionId, isModalOpen: true });
  };

  const pauseOrResume = enrollmentStatus === ENROLLED ? 'Pause Enrollment' : 'Resume Enrollment';

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <RowWrapper onClick={() => {}}>
        {
          rowData.map((item, index) => (
            <StyledCell key={index}>
              <CellContent>
                { item }
              </CellContent>
            </StyledCell>
          ))
        }
        <StyledCell>
          <CellContent>
            <Tag mode={enrollmentStatus === ENROLLED ? 'primary' : 'default'}>
              { enrollmentStatus }
            </Tag>
          </CellContent>
        </StyledCell>
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
              {
                orgHasDataCollectionModule && (
                  <MenuItem
                      data-action-id={TOGGLE_DOWNLOAD_MODAL}
                      onClick={handleMenuItemClick}>
                    Download Data
                  </MenuItem>
                )
              }
              <MenuItem
                  data-action-id={TOGGLE_ENROLLMENT_MODAL}
                  onClick={handleMenuItemClick}>
                { pauseOrResume }
              </MenuItem>
              {
                orgHasSurveyModule && (
                  <MenuItem
                      data-action-id={TOGGLE_TUD_SUBMISSION_HISTORY_MODAL}
                      onClick={handleMenuItemClick}>
                    TUD Submission Dates
                  </MenuItem>
                )
              }
            </Menu>
          </CellContent>
        </StyledCell>
      </RowWrapper>
    </>
  );
};
/* eslint-enable */

export default ParticipantRow;
