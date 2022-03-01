// @flow

import { memo } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './components/ParticipantRow';
import getHeaders from './constants/tableHeaders';

import { PARTICIPANT_ID } from '../../common/constants';
import type { Participant, ParticipantStats } from '../../common/types';

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
