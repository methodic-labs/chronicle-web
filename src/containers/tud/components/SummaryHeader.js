// @flow

import styled from 'styled-components';
import { Typography } from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import DownloadAllButton from './DownloadAllButton';

import type { DataType } from '../constants/DataTypes';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-gap: 30px;
  margin-bottom: 10px;
`;

// TODO: Add additional button to download summarized

type Props = {
  onDownloadData :(date :?DateTime, dataType :DataType) => void;
}

const SummaryHeader = ({ onDownloadData } :Props) => (
  <Wrapper>
    <Typography variant="overline" display="block" gutterBottom>
      Date
    </Typography>

    <Typography variant="overline" display="block" gutterBottom>
      Number of Submissions
    </Typography>
    <div />
    <DownloadAllButton
        onDownloadData={onDownloadData} />
  </Wrapper>
);

export default SummaryHeader;
