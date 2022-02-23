/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, SETTINGS } from '../../../common/constants';
import { GET_STUDY_SETTINGS, getStudySettings } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return getStudySettings.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_STUDY_SETTINGS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_STUDY_SETTINGS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([GET_STUDY_SETTINGS, action.id]);
      if (storedAction) {
        const studyId = storedAction.value;
        return state
          .setIn([SETTINGS, studyId], fromJS(action.value))
          .setIn([GET_STUDY_SETTINGS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([GET_STUDY_SETTINGS, action.id])) {
        return state
          .setIn([GET_STUDY_SETTINGS, ERROR], action.value)
          .setIn([GET_STUDY_SETTINGS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([GET_STUDY_SETTINGS, action.id]),
  });
}
