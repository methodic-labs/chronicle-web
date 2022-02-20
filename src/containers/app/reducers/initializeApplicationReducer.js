/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, SELECTED_ORG_ID } from '../../../common/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return initializeApplication.reducer(state, action, {
    REQUEST: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state
      .set(SELECTED_ORG_ID, action.value[SELECTED_ORG_ID])
      .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
