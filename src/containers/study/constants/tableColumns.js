// @flow

// fields
// TODO: move this to constants
const PARTICIPANT_ID = 'participant_id';
const FIRST_ANDROID_DATA = 'first_android_data';
const LAST_ANDROID_DATA = 'last_android_data';
const IOS_FIRST_DATA = 'ios_first_data';
const IOS_LAST_DATA = 'ios_last_data';
const IOS_UNIQUE_DATES = 'ios_unique_dates';
const ANDROID_DATA_UNIQUE_DAYS = 'android_data_duration';
const FIRST_TUD_SUBMISSION = 'first_tud_submission';
const LAST_TUD_SUBMISSION = 'last_tud_submission';
const TUD_SUBMISSION_UNIQUE_DAYS = 'tud_submission_duration';
const ENROLLMENT_STATUS = 'enrollment_status';
const SELECT_PARTICIPANTS = 'select_participants';
const ACTIONS = 'actions';

const COLUMN_FIELDS = {
  ACTIONS,
  ANDROID_DATA_UNIQUE_DAYS,
  ENROLLMENT_STATUS,
  FIRST_ANDROID_DATA,
  FIRST_TUD_SUBMISSION,
  IOS_FIRST_DATA,
  IOS_LAST_DATA,
  IOS_UNIQUE_DATES,
  LAST_ANDROID_DATA,
  LAST_TUD_SUBMISSION,
  PARTICIPANT_ID,
  SELECT_PARTICIPANTS,
  TUD_SUBMISSION_UNIQUE_DAYS,
};

const HEADER_NAMES = {
  [ANDROID_DATA_UNIQUE_DAYS]: 'Android Data Unique Days',
  [ENROLLMENT_STATUS]: 'Status',
  [FIRST_ANDROID_DATA]: 'Android First Date',
  [FIRST_TUD_SUBMISSION]: 'TUD First Date',
  [IOS_FIRST_DATA]: 'iOS First Date',
  [IOS_LAST_DATA]: 'iOS Last Date',
  [IOS_UNIQUE_DATES]: 'iOS Data Unique Days',
  [LAST_ANDROID_DATA]: 'Android Last Date',
  [LAST_TUD_SUBMISSION]: 'TUD Last Date',
  [PARTICIPANT_ID]: 'Participant Id',
  [TUD_SUBMISSION_UNIQUE_DAYS]: 'TUD Data Unique Days',
};

export { COLUMN_FIELDS, HEADER_NAMES };
