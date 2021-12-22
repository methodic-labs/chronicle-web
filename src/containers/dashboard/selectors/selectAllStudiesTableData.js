// @flow

import { List, Map, getIn } from 'immutable';

import { DASHBOARD_REDUX_CONSTANTS, REDUCERS } from '../../../utils/constants/ReduxConstants';

export default function selectAllStudiesTableData() {
  return (state :Map) :Map => getIn(state, [REDUCERS.DASHBOARD, DASHBOARD_REDUX_CONSTANTS.STUDIES_TABLE], List());
}
