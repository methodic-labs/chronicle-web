/*
 * @flow
 */

import { List, Map } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';

import { IS_OWNER, MY_KEYS, STUDY_ID } from '../../../common/constants';
import { initializeStudy } from '../../../containers/study/actions';
import type { UUID } from '../../../common/types';

export default function reducer(state :Map, action :SequenceAction) {

  return initializeStudy.reducer(state, action, {
    SUCCESS: () => {
      if (action.value[IS_OWNER] === true) {
        const studyId :UUID = action.value[STUDY_ID];
        const keys :List<List<UUID>> = List().push(List([studyId]));
        return state.mergeIn([MY_KEYS], keys);
      }
      return state;
    },
  });
}
