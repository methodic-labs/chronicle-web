/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { STUDIES } from '../../../common/constants';
import type { Study, UUID } from '../../../common/types';

export default function selectStudy(studyId :UUID) {

  return (state :Map) :?Study => getIn(state, [STUDIES, STUDIES, studyId]);
}
