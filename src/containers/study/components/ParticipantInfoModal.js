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

import copyToClipboard from '../../../utils/copyToClipboard';
import { getAppUsageLink, getParticipantLoginLink, getTimeUseDiaryLink } from '../utils';

const Grid = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr auto;
`;

type Props = {
  hasAndroidDataCollection :boolean;
  hasTimeUseDiary :boolean;
  handleOnClose :() => void;
  isVisible :boolean;
  participantId :UUID;
  studyId :UUID;
}

const ParticipantInfoModal = ({
  handleOnClose,
  isVisible,
  participantId,
  studyId,
  hasAndroidDataCollection,
  hasTimeUseDiary
} :Props) => {

  const renderParticipantInfo = () => {
    const enrollmentLink = getParticipantLoginLink(studyId, participantId);
    const timeUseDiaryLink = getTimeUseDiaryLink(studyId, participantId);
    const appUsageLink = getAppUsageLink(studyId, participantId);

    const participantDetails = [
      { name: 'Participant ID', value: participantId },
      { name: 'Study ID', value: studyId }
    ];

    if (hasTimeUseDiary) {
      participantDetails.push({
        name: 'Time Use Diary Link',
        value: timeUseDiaryLink
      });
    }

    if (hasAndroidDataCollection) {
      participantDetails.push({
        name: 'Enrollment Link', value: enrollmentLink
      });
      participantDetails.push({
        name: 'App Usage Link', value: appUsageLink
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
