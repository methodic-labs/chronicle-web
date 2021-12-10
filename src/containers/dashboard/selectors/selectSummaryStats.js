// @flow

import { Map, getIn } from 'immutable';

import { DASHBOARD_REDUX_CONSTANTS, REDUCERS } from '../../../utils/constants/ReduxConstants';

export default function selectSummaryStats() {
  return (state :Map) :Map => getIn(state, [REDUCERS.DASHBOARD, DASHBOARD_REDUX_CONSTANTS.SUMMARY_STATS], Map());
}
