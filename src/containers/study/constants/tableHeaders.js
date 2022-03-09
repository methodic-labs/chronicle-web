// @flow

import { COLUMN_FIELDS, HEADER_NAMES } from './tableColumns';

const {
  ANDROID_DATA_UNIQUE_DAYS,
  ENROLLMENT_STATUS,
  FIRST_ANDROID_DATA,
  FIRST_TUD_SUBMISSION,
  LAST_ANDROID_DATA,
  LAST_TUD_SUBMISSION,
  PARTICIPANT_ID,
  TUD_SUBMISSION_UNIQUE_DAYS,
  SELECT_PARTICIPANTS,
  ACTIONS
} = COLUMN_FIELDS;

const TUD_COLUMNS = [
  {
    key: FIRST_TUD_SUBMISSION,
    label: HEADER_NAMES[FIRST_TUD_SUBMISSION],
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: LAST_TUD_SUBMISSION,
    label: HEADER_NAMES[LAST_TUD_SUBMISSION],
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: TUD_SUBMISSION_UNIQUE_DAYS,
    label: HEADER_NAMES[TUD_SUBMISSION_UNIQUE_DAYS],
    sortable: false,
    cellStyle: {
      fontWeight: 500,
    }
  },
];

const ANDROID_COLUMNS = [
  {
    key: FIRST_ANDROID_DATA,
    label: HEADER_NAMES[FIRST_ANDROID_DATA],
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: LAST_ANDROID_DATA,
    label: HEADER_NAMES[LAST_ANDROID_DATA],
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: ANDROID_DATA_UNIQUE_DAYS,
    label: HEADER_NAMES[ANDROID_DATA_UNIQUE_DAYS],
    sortable: false,
    cellStyle: {
      fontWeight: 500,
    }
  },
];

const PARTICIPANT_ID_COLUMN = {
  key: PARTICIPANT_ID,
  label: HEADER_NAMES[PARTICIPANT_ID],
  cellStyle: {
    fontWeight: 500,
  }
};

const SELECT_PARTICIPANTS_COLUMN = {
  key: SELECT_PARTICIPANTS,
  label: '',
  sortable: false,
  cellStyle: {}
};

const ACTIONS_COLUMN = {
  key: ACTIONS,
  label: '',
  sortable: false,
  cellStyle: {
    fontWeight: 500,
  }
};

const STATUS_COLUMN = {
  key: ENROLLMENT_STATUS,
  label: HEADER_NAMES[ENROLLMENT_STATUS],
  sortable: false,
  cellStyle: {
    fontWeight: 500,
  }
};

type ColumnType = {
  key :string;
  label :string;
  sortable ?:boolean;
  cellStyle :{
    fontWeight :number;
    width ?:string
  }
};

const getColumnsList = (hasTimeUseDiaryModule :boolean, hasDataCollectionModule :boolean) => {
  let result = [SELECT_PARTICIPANTS_COLUMN, PARTICIPANT_ID_COLUMN];
  if (hasDataCollectionModule) {
    result = result.concat(ANDROID_COLUMNS);
  }

  if (hasTimeUseDiaryModule) {
    result = result.concat(TUD_COLUMNS);
  }

  // TODO: Need to update this later for ios sensor

  result.push(STATUS_COLUMN);
  result.push(ACTIONS_COLUMN);

  return result;
};

export default function getHeaders(hasTimeUseDiaryModule :boolean, hasDataCollectionModule :boolean) {
  const columns = getColumnsList(hasTimeUseDiaryModule, hasDataCollectionModule);

  const firstAndLastColumnKeys = [ACTIONS, SELECT_PARTICIPANTS];

  return columns.map<ColumnType>((column :ColumnType) => {
    const width = firstAndLastColumnKeys.includes(column.key) ? '50px' : '200px';
    return {
      ...column,
      cellStyle: {
        ...column.cellStyle,
        width
      }
    };
  });
}
