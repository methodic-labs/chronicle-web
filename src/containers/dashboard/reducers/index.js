// @flow

import { Map, fromJS } from 'immutable';

import getAllStudiesTableDataReducer from './getAllStudiesTableDataReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/ReduxActions';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { GET_ALL_STUDIES_TABLE_DATA } from '../actions';

const INITIAL_STATE :Map = fromJS({

});

export default function dashboardReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case GET_ALL_STUDIES_TABLE_DATA: {
      return getAllStudiesTableDataReducer(state, action);
    }

    default:
      return state;
  }
}
