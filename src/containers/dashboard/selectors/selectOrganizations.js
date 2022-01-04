// @flow

import { Map, getIn } from 'immutable';

import { APP_REDUX_CONSTANTS, REDUCERS } from '../../../utils/constants/ReduxConstants';

export default function selectOrganizations() {
  return (state :Map) :Map => getIn(state, [REDUCERS.APP, APP_REDUX_CONSTANTS.ORGS], Map());
}
