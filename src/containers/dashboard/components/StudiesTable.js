import styled from 'styled-components';
import {
  Card,
  CardSegment,
  Colors,
  Table,
  Typography,
} from 'lattice-ui-kit';

import StudiesTableRow from './StudiesTableRow';
import { STUDIES_TABLE_HEADERS } from './constants';

import generateTableData from '../utils/generateTableData';

const { NEUTRAL } = Colors;

const StyledTableCard = styled(Card)`
  div:last-child {
    overflow-x: scroll;
    height: 520px;
    margin-bottom: 4px;
  }

  table {
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 8px;
    min-width: 958px;

    ::after {
      content: "";
      position: absolute;
      z-index: 1;
      bottom: 1px;
      left: 1px;
      pointer-events: none;
      background-image: linear-gradient(to bottom, rgba(255 255 255 / 0%), rgba(255 255 255 / 100%) 80%);
      width: calc(100% - 2px);
      height: 1em;
      border-radius: 4px;
    }

    th {
      background-color: inherit;
      border: none;
      border-bottom: 1px solid black;
      font-size: 14px;
    }

    tr > :first-child {
      padding-left: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    tr > :last-child {
      padding-right: 16px;
    }

    tr > :nth-last-child(-n+2) {
      text-align: end;
    }

    td {
      border-bottom: 1px solid ${NEUTRAL.N100};
    }
  }
`;

const components = {
  Row: StudiesTableRow
};

const StudiesTable = () => (
  <StyledTableCard>
    <CardSegment padding="16px" borderless>
      <Typography variant="h2">Studies</Typography>
    </CardSegment>
    <Table
        components={components}
        data={generateTableData(25)}
        headers={STUDIES_TABLE_HEADERS} />
  </StyledTableCard>
);

export default StudiesTable;
