// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  GET_NOTIFICATIONS_AUTHORIZATIONS,
  GET_STUDY_AUTHORIZATIONS,
  UPDATE_ES_PERMISSIONS,
  getNotificationsAuthorizations,
  getStudyAuthorizations,
  updateEntitySetPermissions
} from './PermissionsActions';

const INITIAL_STATE :Map = fromJS({
  [GET_STUDY_AUTHORIZATIONS]: {
    requestState: RequestStates.STANDBY
  },
  [UPDATE_ES_PERMISSIONS]: {
    requestState: RequestStates.STANDBY
  },
  [GET_NOTIFICATIONS_AUTHORIZATIONS]: {
    requestState: RequestStates.STANDBY
  }
});

export default function permissionsReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case updateEntitySetPermissions.case(action.type):
      return updateEntitySetPermissions.reducer(state, action, {
        REQUEST: () => state.setIn([UPDATE_ES_PERMISSIONS, 'requestState'], RequestStates.PENDING),
        FAILURE: () => state.setIn([UPDATE_ES_PERMISSIONS, 'requestState'], RequestStates.FAILURE),
        SUCCESS: () => state.setIn([UPDATE_ES_PERMISSIONS, 'requestState'], RequestStates.SUCCESS)
      });

    case getStudyAuthorizations.case(action.type): {
      return getStudyAuthorizations.reducer(state, action, {
        REQUEST: () => state.setIn([GET_STUDY_AUTHORIZATIONS, 'requestState'], RequestStates.PENDING),
        FAILURE: () => state.setIn([GET_STUDY_AUTHORIZATIONS, 'requestState'], RequestStates.FAILURE),
        SUCCESS: () => state.setIn([GET_STUDY_AUTHORIZATIONS, 'requestState'], RequestStates.SUCCESS)
      });
    }

    case getNotificationsAuthorizations.case(action.type): {
      return getNotificationsAuthorizations.reducer(state, action, {
        REQUEST: () => state.setIn([GET_NOTIFICATIONS_AUTHORIZATIONS, 'requestState'], RequestStates.PENDING),
        FAILURE: () => state.setIn([GET_NOTIFICATIONS_AUTHORIZATIONS, 'requestState'], RequestStates.FAILURE),
        SUCCESS: () => state.setIn([GET_NOTIFICATIONS_AUTHORIZATIONS, 'requestState'], RequestStates.SUCCESS)
      });
    }

    default:
      return state;
  }
}
