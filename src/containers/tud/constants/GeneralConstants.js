// @flow

import {
  ACTIVITY_END_TIME,
  ACTIVITY_NAME,
  ACTIVITY_START_TIME,
  ADULT_MEDIA,
  BG_AUDIO_DAY,
  BG_TV_DAY,
  CAREGIVER,
  DAY_OF_WEEK,
  NON_TYPICAL_DAY_REASON,
  NON_TYPICAL_SLEEP_PATTERN,
  OTHER_ACTIVITY,
  PRIMARY_BOOK_TITLE,
  PRIMARY_BOOK_TYPE,
  PRIMARY_MEDIA_ACTIVITY,
  PRIMARY_MEDIA_AGE,
  PRIMARY_MEDIA_NAME,
  SECONDARY_ACTIVITY,
  SECONDARY_MEDIA_ACTIVITY,
  SECONDARY_MEDIA_AGE,
  SECONDARY_MEDIA_NAME,
  SLEEP_ARRANGEMENT,
  SLEEP_PATTERN,
  TYPICAL_DAY_FLAG,
  WAKE_UP_COUNT,
} from '../../../common/constants';

// map from react json form schema properties to easily understandable titles
// the mapped values will appear as ol.title values in the entity data
const QUESTION_TITLE_LOOKUP = {
  [ACTIVITY_END_TIME]: 'Activity end time',
  [ACTIVITY_NAME]: 'Primary activity',
  [ACTIVITY_START_TIME]: 'Activity start time',
  [ADULT_MEDIA]: 'Adult media use',
  [BG_AUDIO_DAY]: 'Background audio',
  [BG_TV_DAY]: 'Background TV',
  [CAREGIVER]: 'Caregiver',
  [DAY_OF_WEEK]: 'Day of week',
  [NON_TYPICAL_DAY_REASON]: 'Non typical day reason',
  [NON_TYPICAL_SLEEP_PATTERN]: 'Non typical sleep reason',
  [OTHER_ACTIVITY]: 'Other activity',
  [PRIMARY_BOOK_TITLE]: 'Primary book title',
  [PRIMARY_BOOK_TYPE]: 'Primary book type',
  [PRIMARY_MEDIA_ACTIVITY]: 'Primary media activity',
  [PRIMARY_MEDIA_AGE]: 'Primary media age',
  [PRIMARY_MEDIA_NAME]: 'Primary media name',
  [SECONDARY_ACTIVITY]: 'Secondary activity',
  [SECONDARY_MEDIA_ACTIVITY]: 'Secondary media activity',
  [SECONDARY_MEDIA_AGE]: 'Secondary media age',
  [SECONDARY_MEDIA_NAME]: 'Secondary media name',
  [SLEEP_ARRANGEMENT]: 'Sleep arrangement',
  [SLEEP_PATTERN]: 'Sleep pattern',
  [TYPICAL_DAY_FLAG]: 'Typical day',
  [WAKE_UP_COUNT]: 'Wake up at night'
};

export {
  QUESTION_TITLE_LOOKUP
};
