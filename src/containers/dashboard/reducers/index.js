// @flow

import { Map, fromJS } from 'immutable';

import getAllStudiesTableDataReducer from './getAllStudiesTableDataReducer';
import getSummaryStatsReducer from './getSummaryStatsReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/ReduxActions';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { DASHBOARD_REDUX_CONSTANTS, RS_INITIAL_STATE } from '../../../utils/constants/ReduxConstants';
import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData, getSummaryStats } from '../actions';

const INITIAL_STATE :Map = fromJS({
  [GET_ALL_STUDIES_TABLE_DATA]: RS_INITIAL_STATE,
  [DASHBOARD_REDUX_CONSTANTS.STUDIES_TABLE]: [],
  [DASHBOARD_REDUX_CONSTANTS.SUMMARY_STATS]: {}
});

export default function dashboardReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case getAllStudiesTableData.case(action.type): {
      return getAllStudiesTableDataReducer(state, action);
    }

    case getSummaryStats.case(action.type): {
      return getSummaryStatsReducer(state, action);
    }

    default:
      return state;
  }
}
