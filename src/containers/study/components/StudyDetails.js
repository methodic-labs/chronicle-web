// @flow

import styled from 'styled-components';
import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  IconButton,
  Tag,
  Tooltip,
  Typography
} from 'lattice-ui-kit';
import { DateTimeUtils, LangUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import copyToClipboard from '../../../utils/copyToClipboard';
import type { Study } from '../../../common/types';

const { formatDateTime } = DateTimeUtils;
const { isNonEmptyString } = LangUtils;

const StyledTag = styled(Tag)`
  margin-left: 0;
`;

const StudyDetails = ({ study } :{ study :Study}) => {
  const getValue = (input :?string) => {
    if (isNonEmptyString(input)) {
      return input;
    }
    return '---';
  };

  const dateCreated = formatDateTime(study.createdAt, DateTime.DATETIME_SHORT);
  const { notificationsEnabled } = study;
  const details = [
    { label: 'Title', value: study.title },
    { label: 'Description', value: getValue(study.description) },
    { label: 'Study Id', value: study.id, enableCopy: true },
    { label: 'Date Created', value: dateCreated },
    { label: 'Contact', value: getValue(study.contact) },
    { label: 'Group', value: getValue(study.group) },
    { label: 'Version', value: getValue(study.version) },
  ];

  return (
    <Box>
      {
        details.map((detail) => (
          <Box mb={2} key={detail.label}>
            <Typography variant="subtitle2">
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
      <Typography> Daily Notifications </Typography>
      <StyledTag mode={notificationsEnabled ? 'primary' : 'default'}>
        {
          notificationsEnabled ? 'Enabled' : 'Disabled'
        }
      </StyledTag>
    </Box>
  );
};

export default StudyDetails;
