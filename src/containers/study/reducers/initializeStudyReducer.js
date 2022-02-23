/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../common/constants';
import { INITIALIZE_STUDY, initializeStudy } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return initializeStudy.reducer(state, action, {
    REQUEST: () => state.setIn([INITIALIZE_STUDY, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state.setIn([INITIALIZE_STUDY, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([INITIALIZE_STUDY, REQUEST_STATE], RequestStates.FAILURE),
  });
}
