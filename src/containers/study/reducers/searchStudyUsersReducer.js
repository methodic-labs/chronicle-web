/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ERROR, REQUEST_STATE, USER_SEARCH_RESULTS } from '../../../common/constants';
import { SEARCH_STUDY_USERS, searchStudyUsers } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return searchStudyUsers.reducer(state, action, {
    REQUEST: () => state
      .setIn([SEARCH_STUDY_USERS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SEARCH_STUDY_USERS, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([SEARCH_STUDY_USERS, action.id])) {
        return state
          .set(USER_SEARCH_RESULTS, fromJS(action.value))
          .setIn([SEARCH_STUDY_USERS, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => {
      if (state.hasIn([SEARCH_STUDY_USERS, action.id])) {
        return state
          .set(USER_SEARCH_RESULTS, List())
          .setIn([SEARCH_STUDY_USERS, ERROR], action.value)
          .setIn([SEARCH_STUDY_USERS, REQUEST_STATE], RequestStates.FAILURE);
      }
      return state;
    },
    FINALLY: () => state.deleteIn([SEARCH_STUDY_USERS, action.id]),
  });
}
