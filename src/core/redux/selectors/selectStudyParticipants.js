/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { PARTICIPANTS, STUDIES } from '../../../common/constants';

export default function selectStudyParticipants(studyId :UUID) {

  return (state :Map) :Map => getIn(state, [STUDIES, PARTICIPANTS, studyId]) || Map();
}
