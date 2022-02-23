// @flow

import { memo } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import getHeaders from './constants/tableHeaders';

import type { Participant } from '../../common/types';

const TableWrapper = styled.div`
  overflow-x: scroll;

  table {
    min-width: 960px;
  }
`;

const ParticipantsTable = ({
  hasDeletePermission,
  orgHasDataCollectionModule,
  orgHasSurveyModule,
  participants,
} :{
  hasDeletePermission :boolean;
  orgHasDataCollectionModule :boolean;
  orgHasSurveyModule :boolean;
  participants :Map<UUID, Participant>;
}) => {

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

// $FlowFixMe
export default memo(ParticipantsTable);
