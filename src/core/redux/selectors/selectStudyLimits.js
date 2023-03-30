/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { LIMITS, STUDIES } from '../../../common/constants';

export default function selectStudyLimits(studyId :UUID) {

  return (state :Map) :Map => getIn(state, [STUDIES, LIMITS, studyId]) || Map();
}
