/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { APP, SELECTED_ORG_ID } from '../../../common/constants';

export default function selectSelectedOrgId() {

  return (state :Map) => getIn(state, [APP, SELECTED_ORG_ID]);
}
