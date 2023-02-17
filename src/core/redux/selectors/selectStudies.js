/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { STUDIES } from '../../../common/constants';

export default function selectStudies() {

  return (state :Map) :Map => getIn(state, [STUDIES, STUDIES]) || Map();
}
