// @flow

import { Map, getIn } from 'immutable';

import { DASHBOARD, SUMMARY_STATS } from '../../../common/constants';

export default function selectSummaryStats() {
  return (state :Map) :Map => getIn(state, [DASHBOARD, SUMMARY_STATS], Map());
}
