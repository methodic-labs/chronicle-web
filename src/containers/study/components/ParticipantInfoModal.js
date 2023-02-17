// @flow

import styled from 'styled-components';
import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  IconButton,
  Modal,
  Tooltip,
  Typography
} from 'lattice-ui-kit';

import { copyToClipboard } from '../../../common/utils';
import { getAppUsageLink, getParticipantLoginLink, getTimeUseDiaryLink } from '../utils';
import { TODAY, YESTERDAY } from '../../../common/constants';

const Grid = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr auto;
`;

type Props = {
  handleOnClose :() => void;
  hasAndroidDataCollection :boolean;
  hasIOSSensorDataCollection :boolean;
  hasTimeUseDiary :boolean;
  isVisible :boolean;
  participantId :UUID;
  studyId :UUID;
}

const ParticipantInfoModal = ({
  handleOnClose,
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasTimeUseDiary,
  isVisible,
  participantId,
  studyId,
} :Props) => {

  const renderParticipantInfo = () => {
    const enrollmentLink = getParticipantLoginLink(studyId, participantId);
    const appUsageLink = getAppUsageLink(studyId, participantId);

    const participantDetails = [
      { name: 'Participant ID', value: participantId },
      { name: 'Study ID', value: studyId }
    ];

    if (hasTimeUseDiary) {
      participantDetails.push({
        name: 'Morning Time Use Diary Link (Activities Yesterday)',
        value: getTimeUseDiaryLink(studyId, participantId, YESTERDAY),
      });
      participantDetails.push({
        name: 'Evening Time Use Diary Link (Activities Today)',
        value: getTimeUseDiaryLink(studyId, participantId, TODAY),
      });
    }

    if (hasAndroidDataCollection || hasIOSSensorDataCollection) {
      participantDetails.push({
        name: 'Enrollment Link',
        value: enrollmentLink,
      });
    }

    if (hasAndroidDataCollection) {
      participantDetails.push({
        name: 'App Usage Link',
        value: appUsageLink,
      });
    }

    return (
      <div>
        {
          participantDetails.map((detail) => (
            <Box mb="20px" maxWidth="600px" key={detail.name}>
              <Typography variant="body2">
                {detail.name}
              </Typography>
              <Grid>
                <Typography variant="body1">
                  { detail.value }
                </Typography>
                <Tooltip
                    arrow
                    placement="top"
                    title="Copy to clipboard">
                  <IconButton
                      aria-label={`Copy ${detail.name}`}
                      onClick={() => copyToClipboard(detail.value)}>
                    <FontAwesomeIcon icon={faCopy} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Box>
          ))
        }
      </div>
    );
  };

  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        textSecondary="Close"
        textTitle="Participant Info">
      {renderParticipantInfo()}
    </Modal>
  );
};

export default ParticipantInfoModal;
