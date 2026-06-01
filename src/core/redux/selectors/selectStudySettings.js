/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { SETTINGS, STUDIES } from '../../../common/constants';

// Stable reference for the "no settings yet" case. Returning a fresh Map() on every call makes
// useSelector hand back a new reference on each store update, which would needlessly re-fire any
// effect that lists the settings in its dependency array before they have loaded.
const EMPTY_SETTINGS :Map = Map();

export default function selectStudySettings(studyId :UUID) {

  return (state :Map) :Map => getIn(state, [STUDIES, SETTINGS, studyId]) || EMPTY_SETTINGS;
}
