/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, SETTINGS } from '../../../common/constants';
import { UPDATE_STUDY_SETTINGS, updateStudySettings } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return updateStudySettings.reducer(state, action, {
    REQUEST: () => state
      .setIn([UPDATE_STUDY_SETTINGS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([UPDATE_STUDY_SETTINGS, action.id], action),
    SUCCESS: () => {
      const storedAction :?SequenceAction = state.getIn([UPDATE_STUDY_SETTINGS, action.id]);
      if (storedAction) {
        const { studyId, settingType, settings } = action.value;
        return state
          .setIn([SETTINGS, studyId, settingType], fromJS(settings))
          .setIn([UPDATE_STUDY_SETTINGS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([UPDATE_STUDY_SETTINGS, action.id])) {
        return state
          .setIn([UPDATE_STUDY_SETTINGS, ERROR], action.value)
          .setIn([UPDATE_STUDY_SETTINGS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([UPDATE_STUDY_SETTINGS, action.id]),
  });
}
