// @flow

import { memo } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import getHeaders from './constants/tableHeaders';

const TableWrapper = styled.div`
  overflow-x: scroll;

  table {
    min-width: 960px;
  }
`;

type Props = {
  hasDeletePermission :Boolean;
  orgHasDataCollectionModule :Boolean;
  orgHasSurveyModule :Boolean;
  participants :Map<UUID, Map>;
};

const ParticipantsTable = (props :Props) => {
  const {
    hasDeletePermission,
    orgHasDataCollectionModule,
    orgHasSurveyModule,
    participants,
  } = props;

  const tableHeaders = getHeaders(orgHasSurveyModule, orgHasDataCollectionModule);

  const components = {
    Row: ({ data: rowData } :any) => (
      <ParticipantRow
          orgHasSurveyModule={orgHasSurveyModule}
          orgHasDataCollectionModule={orgHasDataCollectionModule}
          data={rowData}
          hasDeletePermission={hasDeletePermission} />
    )
  };

  return (
    <TableWrapper>
      <Table
          components={components}
          data={participants.valueSeq().toJS()}
          headers={tableHeaders}
          paginated
          rowsPerPageOptions={[5, 20, 50]} />
    </TableWrapper>
  );
};

export default memo<Props>(ParticipantsTable);
