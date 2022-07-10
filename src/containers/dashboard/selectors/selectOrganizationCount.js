// @flow

import { Map, getIn } from 'immutable';

import { ORGANIZATIONS } from '../../../common/constants';

export default function selectOrganizationCount() {
  return (state :Map) :Number => getIn(state, [ORGANIZATIONS, ORGANIZATIONS], Map()).size;
}
