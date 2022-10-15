// @flow

import { Map, OrderedSet } from 'immutable';

import { SUBMISSION_DATES, TIME_USE_DIARY } from '../../common/constants';

const selectTudSubmissionDates = (participantEntityKeyId :UUID) => (state :Map) => state
  .getIn([TIME_USE_DIARY, SUBMISSION_DATES, participantEntityKeyId], OrderedSet());

export {
  selectTudSubmissionDates
};
