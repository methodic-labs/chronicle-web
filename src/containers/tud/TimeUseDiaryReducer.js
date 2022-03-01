// @flow

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import {
  DOWNLOAD_ALL_TUD_DATA,
  DOWNLOAD_DAILY_TUD_DATA,
  GET_SUBMISSIONS_BY_DATE,
  GET_TUD_SUBMISSION_DATES,
  downloadAllTudData,
  downloadDailyTudData,
  getSubmissionsByDate,
  getTudSubmissionDates,
} from './TimeUseDiaryActions';

import { RESET_REQUEST_STATE } from '../../core/redux/ReduxActions';
import { TUD_REDUX_CONSTANTS } from '../../utils/constants/ReduxConstants';

const { SUBMISSIONS_BY_DATE, SUBMISSION_DATES } = TUD_REDUX_CONSTANTS;

const { REQUEST_STATE } = ReduxConstants;

const INITIAL_STATE = fromJS({
  [DOWNLOAD_ALL_TUD_DATA]: { [REQUEST_STATE]: RequestStates.STANDBY },
  [GET_SUBMISSIONS_BY_DATE]: { [REQUEST_STATE]: RequestStates.STANDBY },
  [GET_TUD_SUBMISSION_DATES]: { [REQUEST_STATE]: RequestStates.STANDBY },
  [SUBMISSIONS_BY_DATE]: Map(),
  [SUBMISSION_DATES]: Map() // { participantEKID -> OrderdSet()}
});

export default function timeUseDiaryReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case RESET_REQUEST_STATE: {
      const { actionType } = action;
      if (actionType && state.has(actionType)) {
        return state.setIn([actionType, REQUEST_STATE], RequestStates.STANDBY);
      }
      return state;
    }

    case getSubmissionsByDate.case(action.type): {
      return getSubmissionsByDate.reducer(state, action, {
        REQUEST: () => state
          .setIn([GET_SUBMISSIONS_BY_DATE, REQUEST_STATE], RequestStates.PENDING)
          .setIn([GET_SUBMISSIONS_BY_DATE, action.id], action),
        FAILURE: () => state.setIn([GET_SUBMISSIONS_BY_DATE, REQUEST_STATE], RequestStates.FAILURE),
        SUCCESS: () => state
          .setIn([GET_SUBMISSIONS_BY_DATE, REQUEST_STATE], RequestStates.SUCCESS)
          .set(SUBMISSIONS_BY_DATE, action.value),
        FINALLY: () => state.deleteIn([GET_SUBMISSIONS_BY_DATE, action.id])
      });
    }

    case downloadDailyTudData.case(action.type): {
      const { date, dataType } = action.value;
      return downloadDailyTudData.reducer(state, action, {
        REQUEST: () => state.setIn([DOWNLOAD_DAILY_TUD_DATA, REQUEST_STATE, date, dataType], RequestStates.PENDING),
        FAILURE: () => state
          .setIn([DOWNLOAD_DAILY_TUD_DATA, REQUEST_STATE, date, dataType], RequestStates.FAILURE),
        SUCCESS: () => state
          .setIn([DOWNLOAD_DAILY_TUD_DATA, REQUEST_STATE, date, dataType], RequestStates.SUCCESS),
        FINALLY: () => state.deleteIn([DOWNLOAD_DAILY_TUD_DATA, action.id])
      });
    }

    case downloadAllTudData.case(action.type): {
      return downloadAllTudData.reducer(state, action, {
        REQUEST: () => state
          .setIn([DOWNLOAD_ALL_TUD_DATA, REQUEST_STATE], RequestStates.PENDING)
          .setIn([DOWNLOAD_ALL_TUD_DATA, action.id], action),
        FAILURE: () => state
          .setIn([DOWNLOAD_ALL_TUD_DATA, REQUEST_STATE], RequestStates.FAILURE),
        SUCCESS: () => state
          .setIn([DOWNLOAD_ALL_TUD_DATA, REQUEST_STATE], RequestStates.SUCCESS),
        FINALLY: () => state
          .deleteIn([DOWNLOAD_ALL_TUD_DATA, action.id])
      });
    }

    case getTudSubmissionDates.case(action.type): {
      return getTudSubmissionDates.reducer(state, action, {
        REQUEST: () => state
          .setIn([GET_TUD_SUBMISSION_DATES, REQUEST_STATE], RequestStates.PENDING)
          .setIn([GET_TUD_SUBMISSION_DATES, action.id], action),
        FAILURE: () => state
          .setIn([GET_TUD_SUBMISSION_DATES, REQUEST_STATE], RequestStates.FAILURE),
        SUCCESS: () => state
          .set(SUBMISSION_DATES, action.value)
          .setIn([GET_TUD_SUBMISSION_DATES, REQUEST_STATE], RequestStates.SUCCESS),
        FINALLY: () => state
          .deleteIn([GET_TUD_SUBMISSION_DATES, action.id])
      });
    }

    default:
      return state;
  }
}
