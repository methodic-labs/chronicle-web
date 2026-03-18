import { CopyIcon } from 'lucide-react';
import styled from 'styled-components';

import { TODAY, YESTERDAY } from '../../../common/constants';
import { copyToClipboard } from '../../../common/utils';
import {
  Box,
  IconButton,
  Modal,
  Tooltip,
  Typography
} from '../../../lattice-ui-kit';
import { getAppUsageLink, getParticipantLoginLink, getTimeUseDiaryLink } from '../utils';

const Grid = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr auto;
`;

const ParticipantInfoModal = ({
  handleOnClose,
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasTimeUseDiary,
  isVisible,
  participantId,
  studyId,
}) => {

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
                    <CopyIcon size={16} />
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
