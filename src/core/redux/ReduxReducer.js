/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { combineReducers } from 'redux-immutable';

import AppReducer from '../../containers/app/reducers';
import AuthReducer from '../auth/reducers';
import OrgsReducer from '../orgs/reducers';
import dashboardReducer from '../../containers/dashboard/reducers';
import edmReducer from '../edm/EDMReducer';
import permissionsReducer from '../permissions/PermissionsReducer';
import questionnareReducer from '../../containers/questionnaire/QuestionnaireReducer';
import studiesReducer from '../../containers/studies/StudiesReducer';
import surveyReducer from '../../containers/survey/SurveyReducer';
import timeUseDiaryReducer from '../../containers/tud/TimeUseDiaryReducer';
import {
  APP,
  AUTH,
  ORGANIZATIONS,
} from '../../common/constants';

export default function reduxReducer(routerHistory :any) {

  return combineReducers({
    [APP]: AppReducer,
    [AUTH]: AuthReducer,
    [ORGANIZATIONS]: OrgsReducer,
    appsData: surveyReducer,
    dashboard: dashboardReducer,
    edm: edmReducer,
    permissions: permissionsReducer,
    questionnaire: questionnareReducer,
    router: connectRouter(routerHistory),
    studies: studiesReducer,
    tud: timeUseDiaryReducer,
  });
}
