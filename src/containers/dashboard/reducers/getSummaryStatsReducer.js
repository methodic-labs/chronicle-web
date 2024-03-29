// @flow

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, SUMMARY_STATS } from '../../../common/constants';
import { GET_SUMMARY_STATS, getSummaryStats } from '../actions';

export default function getSummaryStatsReducer(state :Map, action :SequenceAction) {
  return getSummaryStats.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_SUMMARY_STATS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_SUMMARY_STATS, action.id], action),
    SUCCESS: () => state
      .set(SUMMARY_STATS, action.value)
      .setIn([GET_SUMMARY_STATS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_SUMMARY_STATS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_SUMMARY_STATS, action.id]),
  });
}
