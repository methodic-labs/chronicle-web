/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, SELECTED_ORG_ID } from '../../../common/constants';
import { SWITCH_ORGANIZATION, switchOrganization } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return switchOrganization.reducer(state, action, {
    REQUEST: () => state.setIn([SWITCH_ORGANIZATION, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state
      .set(SELECTED_ORG_ID, action.value)
      .setIn([SWITCH_ORGANIZATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SWITCH_ORGANIZATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
