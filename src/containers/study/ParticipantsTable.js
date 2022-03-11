// @flow

import { memo } from 'react';

import styled from 'styled-components';
import { List, Map, Set } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import getHeaders from './constants/tableHeaders';

import {
  ANDROID_FIRST_DATE,
  ANDROID_LAST_DATE,
  ANDROID_UNIQUE_DATES,
  CANDIDATE,
  ID,
  IOS_FIRST_DATE,
  IOS_LAST_DATE,
  IOS_UNIQUE_DATES,
  PARTICIPANT_ID,
  TUD_FIRST_DATE,
  TUD_LAST_DATE,
  TUD_UNIQUE_DATES
} from '../../common/constants';
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

const defaultStats = {
  [ANDROID_FIRST_DATE]: null,
  [ANDROID_LAST_DATE]: null,
  [ANDROID_UNIQUE_DATES]: [],
  [IOS_FIRST_DATE]: null,
  [IOS_LAST_DATE]: null,
  [IOS_UNIQUE_DATES]: [],
  [TUD_FIRST_DATE]: null,
  [TUD_LAST_DATE]: null,
  [TUD_UNIQUE_DATES]: []
};

const ParticipantsTable = ({
  hasDeletePermission,
  hasDataCollectionModule,
  hasTimeUseDiaryModule,
  iosSensorUseEnabled,
  participants,
  participantStats,
  selectedParticipants
} :{
  hasDeletePermission :boolean;
  hasDataCollectionModule :boolean;
  hasTimeUseDiaryModule :boolean;
  iosSensorUseEnabled :boolean;
  participants :Map<UUID, Participant>;
  participantStats :{ [string] :ParticipantStats };
  selectedParticipants :Set;
}) => {

  const tableData = List().withMutations((mutableList) => {
    participants.forEach((participant, id) => {
      const stats = participantStats[participant[PARTICIPANT_ID]] || defaultStats;
      const result = {
        [ID]: id,
        ...stats,
        ...participant
      };
      mutableList.push(result);
    });
  }).toJS();

  const tableHeaders = getHeaders(
    hasTimeUseDiaryModule,
    hasDataCollectionModule,
    iosSensorUseEnabled
  );

  const components = {
    Row: ({ data: rowData } :any) => (
      <ParticipantRow
          hasDeletePermission={hasDeletePermission}
          hasDataCollectionModule={hasDataCollectionModule}
          hasTimeUseDiaryModule={hasTimeUseDiaryModule}
          iosSensorUseEnabled={iosSensorUseEnabled}
          isSelected={selectedParticipants.has(rowData[CANDIDATE][ID])}
          participant={rowData}
          stats={participantStats[rowData[PARTICIPANT_ID]] || {}} />
    )
  };

  return (
    <TableWrapper>
      <Table
          components={components}
          data={tableData}
          headers={tableHeaders}
          paginated
          rowsPerPageOptions={[20, 50, 100]} />
    </TableWrapper>
  );
};

// $FlowFixMe
export default memo(ParticipantsTable);
