import { CopyIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { StudySettingTypes, TODAY, YESTERDAY } from '../../../common/constants';
import { copyToClipboard } from '../../../common/utils';
import { isGenderedLanguage } from '../../../core/i18n/GenderedLanguages';
import { selectStudySettings } from '../../../core/redux/selectors';
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
  grid-template-columns: minmax(0, 1fr) auto;
`;

const LinkValue = styled(Typography)`
  overflow-wrap: anywhere;
  word-break: break-all;
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

  const studySettings = useSelector(selectStudySettings(studyId));
  const tudLanguage = studySettings.getIn([StudySettingTypes.TIME_USE_DIARY, 'language']);
  const isGendered = tudLanguage && isGenderedLanguage(tudLanguage);

  const renderParticipantInfo = () => {
    const enrollmentLink = getParticipantLoginLink(studyId, participantId);
    const appUsageLink = getAppUsageLink(studyId, participantId);

    const participantDetails = [
      { name: 'Participant ID', value: participantId },
      { name: 'Study ID', value: studyId }
    ];

    if (hasTimeUseDiary) {
      if (isGendered) {
        participantDetails.push({
          name: 'Morning Time Use Diary Link (Activities Yesterday, Male)',
          value: getTimeUseDiaryLink(studyId, participantId, YESTERDAY, studySettings, 'male'),
        });
        participantDetails.push({
          name: 'Morning Time Use Diary Link (Activities Yesterday, Female)',
          value: getTimeUseDiaryLink(studyId, participantId, YESTERDAY, studySettings, 'female'),
        });
        participantDetails.push({
          name: 'Evening Time Use Diary Link (Activities Today, Male)',
          value: getTimeUseDiaryLink(studyId, participantId, TODAY, studySettings, 'male'),
        });
        participantDetails.push({
          name: 'Evening Time Use Diary Link (Activities Today, Female)',
          value: getTimeUseDiaryLink(studyId, participantId, TODAY, studySettings, 'female'),
        });
      }
      else {
        participantDetails.push({
          name: 'Morning Time Use Diary Link (Activities Yesterday)',
          value: getTimeUseDiaryLink(studyId, participantId, YESTERDAY, studySettings),
        });
        participantDetails.push({
          name: 'Evening Time Use Diary Link (Activities Today)',
          value: getTimeUseDiaryLink(studyId, participantId, TODAY, studySettings),
        });
      }
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
                <LinkValue variant="body1">
                  { detail.value }
                </LinkValue>
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
