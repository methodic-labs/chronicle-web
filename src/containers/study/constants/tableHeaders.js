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

const ACTIONS_COLUMN = {
  key: 'actions',
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

export default function getHeaders(orgHasSurveyModule :boolean, orgHasDataCollectionModule :boolean) {
  let data = [PARTICIPANT_ID_COLUMN, ...ANDROID_COLUMNS, ...TUD_COLUMNS, STATUS_COLUMN, ACTIONS_COLUMN];
  if (orgHasSurveyModule && !orgHasDataCollectionModule) {
    data = [PARTICIPANT_ID_COLUMN, ...TUD_COLUMNS, STATUS_COLUMN, ACTIONS_COLUMN];
  }
  if (orgHasDataCollectionModule && !orgHasSurveyModule) {
    data = [PARTICIPANT_ID_COLUMN, ...ANDROID_COLUMNS, STATUS_COLUMN, ACTIONS_COLUMN];
  }

  const numColumns = data.length;
  const lastIndex = numColumns - 1;

  // "actions" column will occupy 5% width, and other columns will share remanining width equally
  const defaultColumnWidth = 95.0 / (numColumns - 1);

  return data.map<ColumnType>((column :ColumnType, index) => {
    if (index === lastIndex) {
      return column;
    }
    return {
      ...column,
      cellStyle: {
        ...column.cellStyle,
        width: `${defaultColumnWidth}%`
      }
    };
  });
}
