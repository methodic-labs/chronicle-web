// @flow

import styled from 'styled-components';
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

import { AppFeatures } from '../../../common/constants';
import { copyToClipboard, formatDateTime, isNonEmptyString } from '../../../common/utils';

import type { Study } from '../../../common/types';

const { NEUTRAL } = Colors;

const StyledTag = styled(Tag)`
  margin-left: 0;
`;

const StudyDetails = ({
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasQuestionnaires,
  hasTimeUseDiary,
  study,
} :{
  hasAndroidDataCollection :boolean;
  hasIOSSensorDataCollection :boolean;
  hasQuestionnaires :boolean;
  hasTimeUseDiary :boolean;
  study :Study;
}) => {
  const getValue = (input :?string) => {
    if (isNonEmptyString(input)) {
      return input;
    }
    return '---';
  };

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
    { label: 'Study Start', value: formatDateTime(study.startedAt, DateTime.DATETIME_FULL) },
    { label: 'Study End', value: formatDateTime(study.endedAt, DateTime.DATETIME_FULL) },
    { label: 'Contact', value: getValue(study.contact) },
    { label: 'Group', value: getValue(study.group) },
    { label: 'Version', value: getValue(study.version) },
  ];

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
            Object.values(AppFeatures).map((feature :any) => (
              <Grid item key={feature}>
                <Chip label={feature} color={features.includes(feature) ? 'primary' : 'default'} />
              </Grid>
            ))
          }
        </Grid>
      </Box>
    </Box>
  );
};

export default StudyDetails;
