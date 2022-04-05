/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, STUDIES, STUDY } from '../../../common/constants';
import { INITIALIZE_STUDY, initializeStudy } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {
  return initializeStudy.reducer(state, action, {
    REQUEST: () => state
      .setIn([INITIALIZE_STUDY, REQUEST_STATE], RequestStates.PENDING)
      .setIn([INITIALIZE_STUDY, action.id], action),
    SUCCESS: () => {
      if (state.hasIn([INITIALIZE_STUDY, action.id])) {
        const study = action.value[STUDY];
        return state
          .setIn([STUDIES, study.id], study)
          .setIn([INITIALIZE_STUDY, REQUEST_STATE], RequestStates.SUCCESS);
      }
      return state;
    },
    FAILURE: () => state.setIn([INITIALIZE_STUDY, REQUEST_STATE], RequestStates.FAILURE),
  });
}
