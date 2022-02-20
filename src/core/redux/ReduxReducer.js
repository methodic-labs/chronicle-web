/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/reducers';
import authReducer from '../auth/reducers';
import dashboardReducer from '../../containers/dashboard/reducers';
import edmReducer from '../edm/EDMReducer';
import orgsReducer from '../orgs/reducers';
import permissionsReducer from '../permissions/PermissionsReducer';
import questionnareReducer from '../../containers/questionnaire/QuestionnaireReducer';
import studiesReducer from '../../containers/studies/reducers';
import surveyReducer from '../../containers/survey/SurveyReducer';
import timeUseDiaryReducer from '../../containers/tud/TimeUseDiaryReducer';
import {
  APP,
  AUTH,
  ORGANIZATIONS,
  STUDIES,
} from '../../common/constants';

export default function reduxReducer(routerHistory :any) {

  return combineReducers({
    [APP]: appReducer,
    [AUTH]: authReducer,
    [ORGANIZATIONS]: orgsReducer,
    [STUDIES]: studiesReducer,
    appsData: surveyReducer,
    dashboard: dashboardReducer,
    edm: edmReducer,
    permissions: permissionsReducer,
    questionnaire: questionnareReducer,
    router: connectRouter(routerHistory),
    tud: timeUseDiaryReducer,
  });
}
