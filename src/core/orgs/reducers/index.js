/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import getOrganizationsReducer from './getOrganizationsReducer';

import {
  ORGANIZATIONS,
  RS_INITIAL_STATE,
} from '../../../common/constants';
import {
  GET_ORGANIZATIONS,
  getOrganizations,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_ORGANIZATIONS]: RS_INITIAL_STATE,
  // data
  [ORGANIZATIONS]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getOrganizations.case(action.type): {
      return getOrganizationsReducer(state, action);
    }

    default: {
      return state;
    }
  }
}
