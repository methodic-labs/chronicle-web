/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  ERROR,
  PERMISSIONS,
  REQUEST_STATE,
  STUDY_ID,
} from '../../../common/constants';
import { UPDATE_STUDY_PERMISSIONS, updateStudyPermissions } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return updateStudyPermissions.reducer(state, action, {
    REQUEST: () => state
      .setIn([UPDATE_STUDY_PERMISSIONS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([UPDATE_STUDY_PERMISSIONS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([UPDATE_STUDY_PERMISSIONS, action.id]);
      if (storedAction) {
        // The response is the study's access after the update, so it replaces what we had rather than merging into it
        // -- a revoke has to be able to remove someone.
        const studyId = storedAction.value[STUDY_ID];
        return state
          .setIn([PERMISSIONS, studyId], fromJS(action.value))
          .setIn([UPDATE_STUDY_PERMISSIONS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([UPDATE_STUDY_PERMISSIONS, action.id])) {
        return state
          .setIn([UPDATE_STUDY_PERMISSIONS, ERROR], action.value)
          .setIn([UPDATE_STUDY_PERMISSIONS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([UPDATE_STUDY_PERMISSIONS, action.id]),
  });
}
