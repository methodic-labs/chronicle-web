/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import createStudyReducer from './createStudyReducer';
import getOrgStudiesReducer from './getOrgStudiesReducer';
import getStudySettingsReducer from './getStudySettingsReducer';
import switchOrganizationReducer from './switchOrganizationReducer';

import {
  RS_INITIAL_STATE,
  SETTINGS,
  STUDIES,
} from '../../../common/constants';
import { switchOrganization } from '../../app/actions';
import {
  CREATE_STUDY,
  GET_ORG_STUDIES,
  GET_STUDY_SETTINGS,
  createStudy,
  getOrgStudies,
  getStudySettings,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [CREATE_STUDY]: RS_INITIAL_STATE,
  [GET_ORG_STUDIES]: RS_INITIAL_STATE,
  [GET_STUDY_SETTINGS]: RS_INITIAL_STATE,
  // data
  [SETTINGS]: Map(),
  [STUDIES]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case createStudy.case(action.type): {
      return createStudyReducer(state, action);
    }

    case getOrgStudies.case(action.type): {
      return getOrgStudiesReducer(state, action);
    }

    case getStudySettings.case(action.type): {
      return getStudySettingsReducer(state, action);
    }

    case switchOrganization.case(action.type): {
      return switchOrganizationReducer(state, action);
    }

    default: {
      return state;
    }
  }
}
