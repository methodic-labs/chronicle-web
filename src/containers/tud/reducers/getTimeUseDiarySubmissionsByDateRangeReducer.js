/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, TIME_USE_DIARY_SUBMISSIONS } from '../../../common/constants';
import { GET_TUD_SUBMISSIONS_BY_DATE_RANGE, getTimeUseDiarySubmissionsByDateRange } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getTimeUseDiarySubmissionsByDateRange.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, action.id])) {
        return state
          .set(TIME_USE_DIARY_SUBMISSIONS, fromJS(action.value))
          .setIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, action.id])) {
        return state
          .setIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, ERROR], action.value)
          .setIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_TUD_SUBMISSIONS_BY_DATE_RANGE, action.id]),
  });
}
