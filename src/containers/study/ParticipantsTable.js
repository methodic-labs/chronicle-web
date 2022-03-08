// @flow

import { memo } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Colors, Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import getHeaders from './constants/tableHeaders';

import { PARTICIPANT_ID } from '../../common/constants';
import type { Participant, ParticipantStats } from '../../common/types';

const { NEUTRAL } = Colors;

const TableWrapper = styled.div`
  &:nth-child(2) {
    overflow-x: auto;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    min-width: 950px;
    overflow-x: scroll;

    th {
      background-color: inherit;
      border: none;
      border-bottom: 1px solid ${NEUTRAL.N200};
      font-size: 14px;
      min-width: 100px;
      white-space: nowrap;
    }
    tbody {
      tr > :last-child {
        position: sticky;
        right: 0;
        background: white;
        index: 1;
      }
    }
    tbody > tr {
      white-space: nowrap;
    }
    th, td {
      min-width: 100px;
      padding: 10px;
    }
  }
`;

const ParticipantsTable = ({
  hasDeletePermission,
  orgHasDataCollectionModule,
  orgHasSurveyModule,
  participants,
  participantStats,
} :{
  hasDeletePermission :boolean;
  orgHasDataCollectionModule :boolean;
  orgHasSurveyModule :boolean;
  participants :Map<UUID, Participant>;
  participantStats :{ [string] :ParticipantStats };
}) => {

  const tableHeaders = getHeaders(orgHasSurveyModule, orgHasDataCollectionModule);

  const components = {
    Row: ({ data: rowData } :any) => (
      <ParticipantRow
          hasDeletePermission={hasDeletePermission}
          orgHasDataCollectionModule={orgHasDataCollectionModule}
          orgHasSurveyModule={orgHasSurveyModule}
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
          rowsPerPageOptions={[5, 20, 50]} />
    </TableWrapper>
  );
};

// $FlowFixMe
export default memo(ParticipantsTable);
