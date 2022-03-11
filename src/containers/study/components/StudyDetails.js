// @flow

import styled from 'styled-components';
import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Chip,
  Colors,
  IconButton,
  Tag,
  Tooltip,
  Typography
} from 'lattice-ui-kit';
import { LangUtils } from 'lattice-utils';

import copyToClipboard from '../../../utils/copyToClipboard';
import type { Study } from '../../../common/types';

const { NEUTRAL } = Colors;

const { isNonEmptyString } = LangUtils;

const StyledTag = styled(Tag)`
  margin-left: 0;
`;

const StudyDetails = ({
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasTimeUseDiary,
  study,
} :{
  hasAndroidDataCollection :boolean;
  hasIOSSensorDataCollection :boolean;
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
    features.push('Android Data Collection');
  }

  if (hasIOSSensorDataCollection) {
    features.push('IOS Sensor Data Collection');
  }
  if (hasTimeUseDiary) {
    features.push('Time Use Diary');
  }

  const { notificationsEnabled } = study;
  const details = [
    { label: 'Title', value: study.title },
    { label: 'Description', value: getValue(study.description) },
    { label: 'Study Id', value: study.id, enableCopy: true },
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
          ENABLED FEATURES
        </Typography>
        <Typography>
          {
            features.map((feature) => (
              <Box component="span" mr={2}>
                <Chip label={feature} />
              </Box>
            ))
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default StudyDetails;
