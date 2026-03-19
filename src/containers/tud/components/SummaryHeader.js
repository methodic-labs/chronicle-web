import styled from 'styled-components';

import { Colors, Typography } from '../../../lattice-ui-kit';
import DownloadAllButton from './DownloadAllButton';

const { NEUTRAL } = Colors;

const Wrapper = styled.div`
  align-items: flex-end;
  background: white;
  border-bottom: 1px solid ${NEUTRAL.N100};
  display: grid;
  grid-gap: 30px;
  grid-template-columns: auto auto 1fr auto;
  margin-bottom: 10px;
  padding-bottom: 10px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const SummaryHeader = ({ onDownloadData }) => (
  <Wrapper>
    <Typography variant="overline" display="block">
      Date
    </Typography>

    <Typography variant="overline" display="block">
      Number of Submissions
    </Typography>
    <div />
    <DownloadAllButton
        onDownloadData={onDownloadData} />
  </Wrapper>
);

export default SummaryHeader;
