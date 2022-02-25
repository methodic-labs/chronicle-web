/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import createStudyReducer from './createStudyReducer';
import getAllStudiesReducer from './getAllStudiesReducer';
import getOrgStudiesReducer from './getOrgStudiesReducer';
import getStudyParticipantsReducer from './getStudyParticipantsReducer';
import getStudySettingsReducer from './getStudySettingsReducer';
import initializeStudyReducer from './initializeStudyReducer';
import registerParticipantReducer from './registerParticipantReducer';

import {
  PARTICIPANTS,
  RS_INITIAL_STATE,
  SETTINGS,
  STUDIES,
} from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { resetRequestStatesReducer } from '../../../core/redux/reducers';
import {
  CREATE_STUDY,
  GET_ALL_STUDIES,
  GET_ORG_STUDIES,
  GET_STUDY_PARTICIPANTS,
  GET_STUDY_SETTINGS,
  INITIALIZE_STUDY,
  REGISTER_PARTICIPANT,
  createStudy,
  getAllStudies,
  getOrgStudies,
  getStudyParticipants,
  getStudySettings,
  initializeStudy,
  registerParticipant,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [CREATE_STUDY]: RS_INITIAL_STATE,
  [GET_ALL_STUDIES]: RS_INITIAL_STATE,
  [GET_ORG_STUDIES]: RS_INITIAL_STATE,
  [GET_STUDY_PARTICIPANTS]: RS_INITIAL_STATE,
  [GET_STUDY_SETTINGS]: RS_INITIAL_STATE,
  [INITIALIZE_STUDY]: RS_INITIAL_STATE,
  [REGISTER_PARTICIPANT]: RS_INITIAL_STATE,
  // data
  [PARTICIPANTS]: Map(),
  [SETTINGS]: Map(),
  [STUDIES]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
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

    // case switchOrganization.case(action.type): {
    //   return switchOrganizationReducer(state, action);
    // }

    default: {
      return state;
    }
  }
}
