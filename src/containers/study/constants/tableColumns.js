// @flow

// fields
const PARTICIPANT_ID = 'participant_id';
const FIRST_ANDROID_DATA = 'first_android_data';
const LAST_ANDROID_DATA = 'last_android_data';
const ANDROID_DATA_DURATION = 'android_data_duration';
const FIRST_TUD_SUBMISSION = 'first_tud_submission';
const LAST_TUD_SUBMISSION = 'last_tud_submission';
const TUD_SUBMISSION_DURATION = 'tud_submission_duration';
const ENROLLMENT_STATUS = 'enrollment_status';

const COLUMN_FIELDS = {
  ANDROID_DATA_DURATION,
  ENROLLMENT_STATUS,
  FIRST_ANDROID_DATA,
  FIRST_TUD_SUBMISSION,
  LAST_ANDROID_DATA,
  LAST_TUD_SUBMISSION,
  PARTICIPANT_ID,
  TUD_SUBMISSION_DURATION,
};

export { COLUMN_FIELDS };

export default {
  [PARTICIPANT_ID]: 'Participant Id',
  [FIRST_ANDROID_DATA]: 'First Android Data',
  [LAST_ANDROID_DATA]: 'Last Android Data',
  [ANDROID_DATA_DURATION]: 'Android Data Duration',
  [FIRST_TUD_SUBMISSION]: 'First TUD Submission',
  [LAST_TUD_SUBMISSION]: 'Last TUD Submission',
  [TUD_SUBMISSION_DURATION]: 'TUD Submission Duration'
};
