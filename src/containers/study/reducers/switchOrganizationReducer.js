/*
 * @flow
 */

import { Map } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';

import { STUDIES } from '../../../common/constants';
import { switchOrganization } from '../../app/actions';

export default function reducer(state :Map, action :SequenceAction) {

  return switchOrganization.reducer(state, action, {
    REQUEST: () => state.setIn([STUDIES], Map())
  });
}
