/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { ORGANIZATIONS } from '../../../common/constants';

export default function selectOrganizations() {

  return (state :Map) :Map => getIn(state, [ORGANIZATIONS, ORGANIZATIONS]) || Map();
}
