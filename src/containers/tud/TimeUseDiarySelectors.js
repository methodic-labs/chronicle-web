// @flow
import { Map, OrderedSet } from 'immutable';

import { REDUCERS, TUD_REDUX_CONSTANTS } from '../../utils/constants/ReduxConstants';

const { TUD } = REDUCERS;
const { SUBMISSION_DATES } = TUD_REDUX_CONSTANTS;

const selectTudSubmissionDates = (participantEntityKeyId :UUID) => (state :Map) => state
  .getIn([TUD, SUBMISSION_DATES, participantEntityKeyId], OrderedSet());

export {
  selectTudSubmissionDates
};
