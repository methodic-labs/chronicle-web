// @flow
import styled from 'styled-components';
import { Cell, Colors } from 'lattice-ui-kit';
import { DateTime } from 'luxon';

const { NEUTRAL } = Colors;

const StyledRow = styled.tr`
  border-bottom: 1px solid ${NEUTRAL.N100};
`;

type StudiesTableRowProps = {
  data :Object
};

const StudiesTableRow = ({ data } :StudiesTableRowProps) => (
  <StyledRow>
    <Cell>
      {data.organization}
    </Cell>
    <Cell>
      {data.studyId}
    </Cell>
    <Cell>
      {DateTime.fromISO(data.dateLaunched).toLocaleString(DateTime.DATE_MED)}
    </Cell>
    <Cell>
      {data.activeParticipants}
    </Cell>
    <Cell>
      {data.totalParticipants}
    </Cell>
  </StyledRow>
);

export default StudiesTableRow;
