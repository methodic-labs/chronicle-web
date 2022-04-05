/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { Map, fromJS } from 'immutable';

import {
  AUTH_TOKEN_EXPIRATION,
  AUTH_TOKEN_EXPIRATION_NOT_SET,
  AUTH_TOKEN_EXPIRED,
  IS_AUTHENTICATING,
} from '../../../common/constants';
import {
  AUTH_ATTEMPT,
  AUTH_EXPIRED,
  AUTH_SUCCESS,
} from '../actions';
import { getAuthTokenExpiration } from '../utils';

const INITIAL_STATE :Map<*, *> = fromJS({
  [AUTH_TOKEN_EXPIRATION]: AUTH_TOKEN_EXPIRATION_NOT_SET,
  [IS_AUTHENTICATING]: false,
});

export default function authReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case AUTH_ATTEMPT:
      return state.set(IS_AUTHENTICATING, true);

    case AUTH_SUCCESS:
      return state
        .set(AUTH_TOKEN_EXPIRATION, getAuthTokenExpiration(action.authToken))
        .set(IS_AUTHENTICATING, false);

    case AUTH_EXPIRED:
      return state
        .set(AUTH_TOKEN_EXPIRATION, AUTH_TOKEN_EXPIRED)
        .set(IS_AUTHENTICATING, false);

    case LOCATION_CHANGE:
      return state.set(AUTH_TOKEN_EXPIRATION, getAuthTokenExpiration());

    default:
      return state;
  }
}
