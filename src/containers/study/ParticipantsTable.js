// @flow

import { memo } from 'react';

import styled from 'styled-components';
import { Map, Set } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import getHeaders from './constants/tableHeaders';

import { CANDIDATE, ID, PARTICIPANT_ID } from '../../common/constants';
import type { Participant, ParticipantStats } from '../../common/types';

const TableWrapper = styled.div`
  > div:nth-child(1) {
    overflow-x: auto;
  }

  table {
    margin-top: 20px;

    th {
      background-color: inherit;
      border: none;
      border-bottom: 1px solid black;
      font-size: 14px;
      padding: 10px;
    }

    td {
      font-size: 15px;
      padding: 10px;
    }

    th:nth-child(1),
    td:nth-child(1) {
      position: sticky;
      left: 0;
      background: white;
      z-index: 500;
    }

    th:nth-child(2),
    td:nth-child(2) {
      position: sticky;
      left: 50px;
      background: white;
      z-index: 500;
    }

    th:last-child,
    td:last-child {
      position: sticky;
      right: 0;
      background: white;
      z-index: 500;
      text-align: right;
    }
  }
`;

const ParticipantsTable = ({
  hasDeletePermission,
  hasDataCollectionModule,
  hasTimeUseDiaryModule,
  participants,
  participantStats,
  selectedParticipants
} :{
  hasDeletePermission :boolean;
  hasDataCollectionModule :boolean;
  hasTimeUseDiaryModule :boolean;
  participants :Map<UUID, Participant>;
  participantStats :{ [string] :ParticipantStats };
  selectedParticipants :Set;
}) => {

  const tableHeaders = getHeaders(hasTimeUseDiaryModule, hasDataCollectionModule);

  const components = {
    Row: ({ data: rowData } :any) => (
      <ParticipantRow
          hasDeletePermission={hasDeletePermission}
          hasDataCollectionModule={hasDataCollectionModule}
          hasTimeUseDiaryModule={hasTimeUseDiaryModule}
          isSelected={selectedParticipants.has(rowData[CANDIDATE][ID])}
          participant={rowData}
          stats={participantStats[rowData[PARTICIPANT_ID]] || {}} />
    )
  };

  return (
    <TableWrapper>
      <Table
          components={components}
          data={participants.valueSeq().toJS()}
          headers={tableHeaders}
          paginated
          rowsPerPageOptions={[20, 50, 100]} />
    </TableWrapper>
  );
};

// $FlowFixMe
export default memo(ParticipantsTable);
