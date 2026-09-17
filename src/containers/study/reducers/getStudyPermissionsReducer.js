/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, PERMISSIONS, REQUEST_STATE } from '../../../common/constants';
import { GET_STUDY_PERMISSIONS, getStudyPermissions } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getStudyPermissions.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_STUDY_PERMISSIONS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_STUDY_PERMISSIONS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([GET_STUDY_PERMISSIONS, action.id]);
      if (storedAction) {
        const studyId = storedAction.value;
        return state
          .setIn([PERMISSIONS, studyId], fromJS(action.value))
          .setIn([GET_STUDY_PERMISSIONS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_STUDY_PERMISSIONS, action.id])) {
        return state
          .setIn([GET_STUDY_PERMISSIONS, ERROR], action.value)
          .setIn([GET_STUDY_PERMISSIONS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_STUDY_PERMISSIONS, action.id]),
  });
}
