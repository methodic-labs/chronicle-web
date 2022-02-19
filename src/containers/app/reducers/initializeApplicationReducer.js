/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ORGANIZATIONS, REQUEST_STATE, SELECTED_ORG_ID } from '../../../common/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';
import { getOrganizationId } from '../../../common/utils';

export default function reducer(state :Map, action :SequenceAction) {

  return initializeApplication.reducer(state, action, {
    REQUEST: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => {
      const organizations :Map = action.value[ORGANIZATIONS];
      let selectedOrgId = organizations.first()?.id;
      const storedOrgId = getOrganizationId();
      if (storedOrgId && organizations.has(storedOrgId)) {
        selectedOrgId = storedOrgId;
      }
      return state
        .set(SELECTED_ORG_ID, selectedOrgId)
        .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
