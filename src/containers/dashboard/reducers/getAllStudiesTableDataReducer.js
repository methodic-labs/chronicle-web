// @flow

import { Map } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData } from '../actions';

const { REQUEST_STATE } = ReduxConstants;

export default function getAllStudiesTableDataReducer(state :Map, action :SequenceAction) {
  return getAllStudiesTableData.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_ALL_STUDIES_TABLE_DATA, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_ALL_STUDIES_TABLE_DATA, action.id], action),
    SUCCESS: () => state.setIn([GET_ALL_STUDIES_TABLE_DATA, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_ALL_STUDIES_TABLE_DATA, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_ALL_STUDIES_TABLE_DATA, action.id]),
  });
}
