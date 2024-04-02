import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Chip,
  Colors,
  Grid,
  IconButton,
  Tag,
  Tooltip,
  Typography
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import styled from 'styled-components';

import { AppFeatures, IOSSensorTypes } from '../../../common/constants';
import { copyToClipboard, formatDateTime, isNonEmptyString } from '../../../common/utils';

const { NEUTRAL } = Colors;

const StyledTag = styled(Tag)`
  margin-left: 0;
`;

const getValue = (input) => {
  if (isNonEmptyString(input)) {
    return input;
  }
  return '---';
};

const StudyDetails = ({
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasQuestionnaires,
  hasTimeUseDiary,
  limits,
  study,
}) => {
  const features = [];
  if (hasAndroidDataCollection) {
    features.push(AppFeatures.ANDROID);
  }

  if (hasIOSSensorDataCollection) {
    features.push(AppFeatures.IOS_SENSOR);
  }
  if (hasTimeUseDiary) {
    features.push(AppFeatures.TIME_USE_DIARY);
  }

  if (hasQuestionnaires) {
    features.push(AppFeatures.SURVEYS);
  }

  const { notificationsEnabled } = study;
  const details = [
    { label: 'Title', value: study.title },
    { label: 'Description', value: getValue(study.description) },
    { label: 'Study Id', value: study.id, enableCopy: true },
    {
      label: 'Maximum Participants',
      value: getValue(`${limits.get('participantLimit')}`),
    },
    {
      label: 'Study Created',
      value: formatDateTime(study.createdAt, DateTime.DATETIME_FULL),
    },
    {
      label: 'Study Data Collections Ends',
      value: formatDateTime(limits.get('studyEnds'), DateTime.DATETIME_FULL),
    },
    {
      label: 'Study Data Will Be Deleted After',
      value: formatDateTime(limits.get('studyDataExpires'), DateTime.DATETIME_FULL),
    },
    { label: 'Contact', value: getValue(study.contact) },
    { label: 'Group', value: getValue(study.group) },
    { label: 'Version', value: getValue(study.version) },
  ];

  let iosSensors = [];
  if (hasIOSSensorDataCollection) {
    const sensors = study?.settings?.Sensor?.[1];
    if (Array.isArray(sensors)) {
      iosSensors = sensors;
    }
  }

  return (
    <Box>
      {
        details.map((detail) => (
          <Box mb={2} key={detail.label}>
            <Typography style={{ color: NEUTRAL.N500 }} variant="subtitle1">
              { detail.label.toUpperCase() }
            </Typography>
            <Typography>
              { detail.value }
              {
                detail.enableCopy && (
                  <Box component="span" ml="5px">
                    <Tooltip
                        arrow
                        placement="top"
                        title="Copy to clipboard">
                      <IconButton
                          aria-label={`Copy ${detail.label}`}
                          onClick={() => copyToClipboard(detail.value)}>
                        <FontAwesomeIcon icon={faCopy} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )
              }
            </Typography>

          </Box>
        ))
      }
      <Typography style={{ color: NEUTRAL.N500 }} variant="subtitle1"> DAILY NOTIFICATIONS </Typography>
      <StyledTag mode={notificationsEnabled ? 'primary' : 'neutral'}>
        {
          notificationsEnabled ? 'Enabled' : 'Disabled'
        }
      </StyledTag>
      <Box mt={2}>
        <Typography style={{ color: NEUTRAL.N500 }} variant="subtitle1">
          FEATURES
        </Typography>
        <Box mt={1} />
        <Grid container spacing={2}>
          {
            Object.values(AppFeatures).map((feature) => (
              <Grid item key={feature}>
                <Chip label={feature} color={features.includes(feature) ? 'primary' : 'default'} />
              </Grid>
            ))
          }
        </Grid>
      </Box>
      {
        hasIOSSensorDataCollection && (
          <>
            <Box mt={2}>
              <Typography style={{ color: NEUTRAL.N500 }} variant="subtitle1">
                IOS SENSORS
              </Typography>
            </Box>
            <Box mt={1} />
            <Grid container spacing={2}>
              {
                Object.values(IOSSensorTypes).map((st) => (
                  <Grid item key={st}>
                    <Chip label={st} color={iosSensors.includes(st) ? 'primary' : 'default'} />
                  </Grid>
                ))
              }
            </Grid>
          </>
        )
      }
    </Box>
  );
};

export default StudyDetails;
