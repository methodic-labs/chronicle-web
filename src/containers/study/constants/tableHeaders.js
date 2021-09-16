// @flow

import HeaderNames, { COLUMN_FIELDS } from './tableColumns';

const {
  PARTICIPANT_ID,
  FIRST_ANDROID_DATA,
  LAST_ANDROID_DATA,
  ANDROID_DATA_DURATION,
  FIRST_TUD_SUBMISSION,
  LAST_TUD_SUBMISSION,
  TUD_SUBMISSION_DURATION
} = COLUMN_FIELDS;

const TABLE_HEADERS = [
  {
    key: PARTICIPANT_ID,
    label: HeaderNames[PARTICIPANT_ID],
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: FIRST_ANDROID_DATA,
    label: HeaderNames[FIRST_ANDROID_DATA],
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: LAST_ANDROID_DATA,
    label: HeaderNames[LAST_ANDROID_DATA],
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: ANDROID_DATA_DURATION,
    label: HeaderNames[ANDROID_DATA_DURATION],
    sortable: false,
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: FIRST_TUD_SUBMISSION,
    label: HeaderNames[FIRST_TUD_SUBMISSION],
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: LAST_TUD_SUBMISSION,
    label: HeaderNames[LAST_TUD_SUBMISSION],
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: TUD_SUBMISSION_DURATION,
    label: HeaderNames[TUD_SUBMISSION_DURATION],
    sortable: false,
    cellStyle: {
      width: '13%',
      fontWeight: 500,
      textAlign: 'center'
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    cellStyle: {
      fontWeight: 500,
      textAlign: 'center'
    }
  },
];

export default TABLE_HEADERS;
