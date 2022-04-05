/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../common/constants';
import { SUBMIT_TIME_USE_DIARY, submitTimeUseDiary } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return submitTimeUseDiary.reducer(state, action, {
    REQUEST: () => state.setIn([SUBMIT_TIME_USE_DIARY, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state.setIn([SUBMIT_TIME_USE_DIARY, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SUBMIT_TIME_USE_DIARY, REQUEST_STATE], RequestStates.FAILURE),
  });
}
