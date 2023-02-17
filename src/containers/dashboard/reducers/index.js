// @flow

import { Map, fromJS } from 'immutable';

import getAllStudiesTableDataReducer from './getAllStudiesTableDataReducer';
import getSummaryStatsReducer from './getSummaryStatsReducer';

import { RS_INITIAL_STATE, STUDIES_TABLE, SUMMARY_STATS } from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { resetRequestStatesReducer } from '../../../core/redux/reducers';
import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData, getSummaryStats } from '../actions';

const INITIAL_STATE :Map = fromJS({
  [GET_ALL_STUDIES_TABLE_DATA]: RS_INITIAL_STATE,
  [STUDIES_TABLE]: [],
  [SUMMARY_STATS]: {}
});

export default function dashboardReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
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
