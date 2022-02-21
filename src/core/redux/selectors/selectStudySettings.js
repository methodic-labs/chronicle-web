/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { SETTINGS, STUDIES } from '../../../common/constants';

export default function selectStudySettings(studyId :UUID) {

  return (state :Map) :Map => getIn(state, [STUDIES, SETTINGS, studyId]) || Map();
}
