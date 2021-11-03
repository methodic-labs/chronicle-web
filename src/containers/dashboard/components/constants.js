import dateTimeComparator from '../utils/dateTimeComparator';

const STUDIES_TABLE_HEADERS = [
  { key: 'organization', label: 'Organization' },
  { key: 'studyId', label: 'Study ID', cellStyle: { width: '39ch' } },
  {
    key: 'dateLaunched',
    label: 'Date Launched',
    cellStyle: { width: '148px' },
    comparator: dateTimeComparator
  },
  { key: 'activeParticipants', label: 'Active Part.', cellStyle: { width: '120px' } },
  { key: 'totalParticipants', label: 'Total Part.', cellStyle: { width: '120px' } },
];

export {
  STUDIES_TABLE_HEADERS
};
