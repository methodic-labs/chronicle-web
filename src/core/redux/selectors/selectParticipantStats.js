/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { STATS, STUDIES } from '../../../common/constants';
import type { ParticipantStats } from '../../../common/types';

export default function selectParticipantStats(studyId :UUID) {

  return (state :Map) :{ [string] :ParticipantStats } => getIn(state, [STUDIES, STATS, studyId]) || Map();
}
