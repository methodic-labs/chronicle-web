// @flow

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import TABLE_HEADERS from './constants/tableHeaders';

const TableWrapper = styled.div`
  overflow-x: scroll;

  table {
    min-width: 960px;
  }
`;

type Props = {
  hasDeletePermission :Boolean;
  participants :Map<UUID, Map>;
};

const ParticipantsTable = (props :Props) => {
  const { hasDeletePermission, participants } = props;

  // const HeadCell = styled.td`
  //   color: red
  // `;

  const components = {
    Row: ({ data: rowData } :any) => (
      <ParticipantRow
          data={rowData}
          hasDeletePermission={hasDeletePermission} />
    )
  };

  return (
    <TableWrapper>
      <Table
          components={components}
          data={participants.valueSeq().toJS()}
          headers={TABLE_HEADERS}
          paginated
          rowsPerPageOptions={[5, 20, 50]} />
    </TableWrapper>
  );
};

export default React.memo<Props>(ParticipantsTable);
