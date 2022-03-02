/*
 * @flow
 */

import {
  List,
  Map,
  Set,
  getIn,
} from 'immutable';

import { MY_KEYS, PERMISSIONS } from '../../../common/constants';
import type { UUID } from '../../../common/types';

export default function selectMyKeys() {

  return (state :Map) :Set<List<UUID>> => getIn(state, [PERMISSIONS, MY_KEYS]) || Set();
}
