// @flow

import { List, Map, getIn } from 'immutable';

import { DASHBOARD, STUDIES_TABLE } from '../../../common/constants';

export default function selectAllStudiesTableData() {
  return (state :Map) :Map => getIn(state, [DASHBOARD, STUDIES_TABLE], List());
}
