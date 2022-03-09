// @flow

// fields
const PARTICIPANT_ID = 'participant_id';
const FIRST_ANDROID_DATA = 'first_android_data';
const LAST_ANDROID_DATA = 'last_android_data';
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
  LAST_ANDROID_DATA,
  LAST_TUD_SUBMISSION,
  PARTICIPANT_ID,
  SELECT_PARTICIPANTS,
  TUD_SUBMISSION_UNIQUE_DAYS,
};

const HEADER_NAMES = {
  [PARTICIPANT_ID]: 'Participant Id',
  [FIRST_ANDROID_DATA]: 'First Android Data',
  [LAST_ANDROID_DATA]: 'Last Android Data',
  [ANDROID_DATA_UNIQUE_DAYS]: 'Android Data Unique Days',
  [FIRST_TUD_SUBMISSION]: 'First TUD Submission',
  [LAST_TUD_SUBMISSION]: 'Last TUD Submission',
  [TUD_SUBMISSION_UNIQUE_DAYS]: 'TUD Submission Unique Days',
  [ENROLLMENT_STATUS]: 'Status'
};

export { COLUMN_FIELDS, HEADER_NAMES };
