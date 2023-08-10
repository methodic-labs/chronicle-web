// @flow

import {
  ANDROID_FIRST_DATE,
  ANDROID_LAST_DATE,
  ANDROID_UNIQUE_DATES,
  IOS_FIRST_DATE,
  IOS_LAST_DATE,
  IOS_UNIQUE_DATES,
  PARTICIPANT_ID,
  PARTICIPATION_STATUS,
  TUD_FIRST_DATE,
  TUD_LAST_DATE,
  TUD_UNIQUE_DATES
} from '../../../common/constants';

const comparator = (a, b) => {
  if (a === b) {
    return 0;
  }
  const isDefinedA = a !== null && a !== undefined;
  const isDefinedB = b !== null && b !== undefined;
  if (isDefinedA && !isDefinedB) {
    return 1;
  }
  if (isDefinedB && !isDefinedA) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

const TUD_COLUMNS = [
  {
    key: TUD_FIRST_DATE,
    label: 'TUD First Submission',
    comparator,
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: TUD_LAST_DATE,
    label: 'TUD Last Submission',
    comparator,
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: TUD_UNIQUE_DATES,
    label: 'TUD Unique Days',
    sortable: false,
    cellStyle: {
      fontWeight: 500,
    }
  },
];

const IOS_COLUMNS = [
  {
    key: IOS_FIRST_DATE,
    label: 'iOS First Data',
    comparator,
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: IOS_LAST_DATE,
    label: 'iOS Last Data',
    comparator,
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: IOS_UNIQUE_DATES,
    label: 'iOS Data Unique Days',
    sortable: false,
    cellStyle: {
      fontWeight: 500,
    }
  },
];

const ANDROID_COLUMNS = [
  {
    key: ANDROID_FIRST_DATE,
    label: 'Android First Data',
    comparator,
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: ANDROID_LAST_DATE,
    label: 'Android Last Data',
    comparator,
    cellStyle: {
      fontWeight: 500,
    }
  },
  {
    key: ANDROID_UNIQUE_DATES,
    label: 'Android Data Unique Days',
    sortable: false,
    cellStyle: {
      fontWeight: 500,
    }
  },
];

const PARTICIPANT_ID_COLUMN = {
  key: PARTICIPANT_ID,
  label: 'Participant Id',
  comparator,
  cellStyle: {
    fontWeight: 500,
    width: '150px'
  }
};

// 2022-03-24 not needed for now. Will restore later
// const SELECT_PARTICIPANTS_COLUMN = {
//   key: 'select_participants',
//   label: '',
//   sortable: false,
//   cellStyle: {
//     width: '50px'
//   }
// };

const ACTIONS_COLUMN = {
  key: 'actions',
  label: '',
  sortable: false,
  cellStyle: {
    fontWeight: 500,
    width: '50px'
  }
};

const STATUS_COLUMN = {
  key: PARTICIPATION_STATUS,
  label: 'Status',
  sortable: false,
  cellStyle: {
    fontWeight: 500,
    width: '100px'
  }
};

type ColumnType = {
  key :string;
  label :string;
  sortable ?:boolean;
  cellStyle :{
    width ?:string
  }
};

const getColumnsList = (
  hasTimeUseDiary :boolean,
  hasAndroidDataCollection :boolean,
  hasIOSSensorDataCollection :boolean
) => {
  // 2022-03-11 remove SELECT_PARTICIPANTS_COLUMN for now
  let result = [PARTICIPANT_ID_COLUMN];
  if (hasAndroidDataCollection) {
    result = result.concat(ANDROID_COLUMNS);
  }

  if (hasIOSSensorDataCollection) {
    result = result.concat(IOS_COLUMNS);
  }

  if (hasTimeUseDiary) {
    result = result.concat(TUD_COLUMNS);
  }

  result.push(STATUS_COLUMN);
  result.push(ACTIONS_COLUMN);

  return result;
};

export default function getHeaders(
  hasTimeUseDiary :boolean,
  hasAndroidDataCollection :boolean,
  hasIOSSensorDataCollection :boolean
) {
  const columns = getColumnsList(hasTimeUseDiary, hasAndroidDataCollection, hasIOSSensorDataCollection);

  return columns.map<ColumnType>((column :ColumnType) => {
    const width = column.cellStyle?.width || '200px';
    return {
      ...column,
      cellStyle: {
        ...column.cellStyle,
        width
      }
    };
  });
}
