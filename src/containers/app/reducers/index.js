/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import initializeApplicationReducer from './initializeApplicationReducer';
import switchOrganizationReducer from './switchOrganizationReducer';

import { RS_INITIAL_STATE } from '../../../common/constants';
import {
  INITIALIZE_APPLICATION,
  SWITCH_ORGANIZATION,
  initializeApplication,
  switchOrganization,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  [INITIALIZE_APPLICATION]: RS_INITIAL_STATE,
  [SWITCH_ORGANIZATION]: RS_INITIAL_STATE,
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case initializeApplication.case(action.type): {
      return initializeApplicationReducer(state, action);
    }

    case switchOrganization.case(action.type): {
      return switchOrganizationReducer(state, action);
    }

    default:
      return state;
  }
}
