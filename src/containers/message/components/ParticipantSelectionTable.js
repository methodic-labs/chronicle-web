// @flow
import { Map } from 'immutable';
import { Table } from 'lattice-ui-kit';

import ParticipantRow from './ParticipantRow';

import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';

const { PERSON_ID } = PROPERTY_TYPE_FQNS;

const HEADERS = [
  {
    key: 'id',
    label: 'Participant Id'
  },
  {
    key: 'actions',
    label: '',
    sortable: false,
    cellStyle: { width: '50px' }
  }
];

const ParticipantSelectionTable = ({
  handleOnSelect,
  participants,
  targetParticipants
} :{
  handleOnSelect :(participants :Map) => void;
  participants :Map;
  targetParticipants :Map;
}) => {

  const participantOptions = participants
    .valueSeq()
    .map((participant) => ({ id: participant.getIn([PERSON_ID, 0], '') }))
    .toJS();

  const components = {
    Row: ({ data: rowData } :any) => (
      <ParticipantRow
          data={rowData}
          handleOnSelect={handleOnSelect}
          targetParticipants={targetParticipants} />
    )
  };

  return (
    <Table
        components={components}
        data={participantOptions}
        headers={HEADERS}
        paginated={participantOptions.length > 5}
        rowsPerPageOptions={[5, 10, 15]} />
  );
};

export default ParticipantSelectionTable;
