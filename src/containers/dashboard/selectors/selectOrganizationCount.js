// @flow

import { Map, getIn } from 'immutable';

import { APP_REDUX_CONSTANTS, REDUCERS } from '../../../utils/constants/ReduxConstants';

export default function selectOrganizationCount() {
  return (state :Map) :Number => getIn(state, [REDUCERS.APP, APP_REDUX_CONSTANTS.ORGS], Map()).size;
}
