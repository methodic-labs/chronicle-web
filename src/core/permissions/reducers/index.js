/*
 * @flow
 */

import { Map, Set, fromJS } from 'immutable';

import initializeStudyReducer from './initializeStudyReducer';

import { MY_KEYS } from '../../../common/constants';
import { RESET_REQUEST_STATES } from '../../redux/actions';
import { resetRequestStatesReducer } from '../../redux/reducers';
import { initializeStudy } from '../../../containers/study/actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  // data
  [MY_KEYS]: Set(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }
    case initializeStudy.case(action.type): {
      return initializeStudyReducer(state, action);
    }

    default:
      return state;
  }
}
