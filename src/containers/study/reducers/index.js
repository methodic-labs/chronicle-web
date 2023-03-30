/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import changeEnrollmentReducer from './changeEnrollmentReducer';
import createStudyReducer from './createStudyReducer';
import deleteStudyParticipantsReducer from './deleteStudyParticipantsReducer';
import deleteStudyReducer from './deleteStudyReducer';
import getAllStudiesReducer from './getAllStudiesReducer';
import getOrgStudiesReducer from './getOrgStudiesReducer';
import getParticipantStatsReducer from './getParticipantStatsReducer';
import getStudyLimitsReducer from './getStudyLimitsReducer';
import getStudyParticipantsReducer from './getStudyParticipantsReducer';
import getStudySettingsReducer from './getStudySettingsReducer';
import initializeStudyReducer from './initializeStudyReducer';
import registerParticipantReducer from './registerParticipantReducer';
import updateStudyReducer from './updateStudyReducer';
import verifyParticipantReducer from './verifyParticipantReducer';

import {
  PARTICIPANTS,
  RS_INITIAL_STATE,
  SETTINGS,
  STATS,
  STUDIES,
} from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { resetRequestStatesReducer } from '../../../core/redux/reducers';
import {
  CHANGE_ENROLLMENT_STATUS,
  CREATE_STUDY,
  DELETE_STUDY,
  DELETE_STUDY_PARTICIPANTS,
  GET_ALL_STUDIES,
  GET_ORG_STUDIES,
  GET_PARTICIPANT_STATS,
  GET_STUDY_LIMITS,
  GET_STUDY_PARTICIPANTS,
  GET_STUDY_SETTINGS,
  INITIALIZE_STUDY,
  REGISTER_PARTICIPANT,
  REMOVE_STUDY_ON_DELETE,
  UPDATE_STUDY,
  VERIFY_PARTICIPANT,
  changeEnrollmentStatus,
  createStudy,
  deleteStudy,
  deleteStudyParticipants,
  getAllStudies,
  getOrgStudies,
  getParticipantStats,
  getStudyLimits,
  getStudyParticipants,
  getStudySettings,
  initializeStudy,
  registerParticipant,
  updateStudy,
  verifyParticipant
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [CHANGE_ENROLLMENT_STATUS]: RS_INITIAL_STATE,
  [CREATE_STUDY]: RS_INITIAL_STATE,
  [DELETE_STUDY]: RS_INITIAL_STATE,
  [DELETE_STUDY_PARTICIPANTS]: RS_INITIAL_STATE,
  [GET_ALL_STUDIES]: RS_INITIAL_STATE,
  [GET_ORG_STUDIES]: RS_INITIAL_STATE,
  [GET_PARTICIPANT_STATS]: RS_INITIAL_STATE,
  [GET_STUDY_LIMITS]: RS_INITIAL_STATE,
  [GET_STUDY_PARTICIPANTS]: RS_INITIAL_STATE,
  [GET_STUDY_SETTINGS]: RS_INITIAL_STATE,
  [INITIALIZE_STUDY]: RS_INITIAL_STATE,
  [REGISTER_PARTICIPANT]: RS_INITIAL_STATE,
  [UPDATE_STUDY]: RS_INITIAL_STATE,
  [VERIFY_PARTICIPANT]: RS_INITIAL_STATE,
  // data
  [PARTICIPANTS]: Map(),
  [SETTINGS]: Map(),
  [STATS]: Map(),
  [STUDIES]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }

    case REMOVE_STUDY_ON_DELETE: {
      const { studyId } = action;
      return state.deleteIn([STUDIES, studyId]);
    }

    case changeEnrollmentStatus.case(action.type): {
      return changeEnrollmentReducer(state, action);
    }

    case deleteStudy.case(action.type): {
      return deleteStudyReducer(state, action);
    }

    case deleteStudyParticipants.case(action.type): {
      return deleteStudyParticipantsReducer(state, action);
    }

    case createStudy.case(action.type): {
      return createStudyReducer(state, action);
    }

    case getAllStudies.case(action.type): {
      return getAllStudiesReducer(state, action);
    }

    case getOrgStudies.case(action.type): {
      return getOrgStudiesReducer(state, action);
    }

    case getParticipantStats.case(action.type): {
      return getParticipantStatsReducer(state, action);
    }

    case getStudyLimits.case(action.type): {
      return getStudyLimitsReducer(state, action);
    }

    case getStudyParticipants.case(action.type): {
      return getStudyParticipantsReducer(state, action);
    }

    case getStudySettings.case(action.type): {
      return getStudySettingsReducer(state, action);
    }

    case initializeStudy.case(action.type): {
      return initializeStudyReducer(state, action);
    }

    case registerParticipant.case(action.type): {
      return registerParticipantReducer(state, action);
    }

    case updateStudy.case(action.type): {
      return updateStudyReducer(state, action);
    }

    case verifyParticipant.case(action.type): {
      return verifyParticipantReducer(state, action);
    }

    // case switchOrganization.case(action.type): {
    //   return switchOrganizationReducer(state, action);
    // }

    default: {
      return state;
    }
  }
}
