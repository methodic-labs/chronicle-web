/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import createStudyReducer from './createStudyReducer';
import getOrgStudiesReducer from './getOrgStudiesReducer';

import {
  STUDIES,
  RS_INITIAL_STATE,
} from '../../../common/constants';
import {
  CREATE_STUDY,
  GET_ORG_STUDIES,
  // UPDATE_STUDY,
  createStudy,
  getOrgStudies,
  // updateStudy,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [CREATE_STUDY]: RS_INITIAL_STATE,
  [GET_ORG_STUDIES]: RS_INITIAL_STATE,
  // data
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

    default: {
      return state;
    }
  }
}
