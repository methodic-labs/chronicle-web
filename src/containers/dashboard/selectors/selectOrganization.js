// @flow

import { Map, getIn } from 'immutable';

import { ORGANIZATIONS } from '../../../common/constants';

export default function selectOrganization(orgId :UUID) {
  return (state :Map) :Map => getIn(state, [ORGANIZATIONS, ORGANIZATIONS, orgId], Map());
}
