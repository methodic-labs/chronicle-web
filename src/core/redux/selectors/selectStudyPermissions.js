/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { PERMISSIONS, STUDIES } from '../../../common/constants';
import type { UUID } from '../../../common/types';

// Stable reference for the "not loaded yet" case, so that useSelector doesn't hand back a new Map on every store
// update and re-fire effects that depend on it.
const EMPTY_PERMISSIONS :Map = Map();

export default function selectStudyPermissions(studyId :UUID) {

  return (state :Map) :Map => getIn(state, [STUDIES, PERMISSIONS, studyId]) || EMPTY_PERMISSIONS;
}
