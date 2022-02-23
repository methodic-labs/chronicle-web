/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/reducers';
import appUsageSurveyReducer from '../../containers/survey/reducers';
import authReducer from '../auth/reducers';
import dashboardReducer from '../../containers/dashboard/reducers';
import edmReducer from '../edm/EDMReducer';
import orgsReducer from '../orgs/reducers';
import permissionsReducer from '../permissions/reducers';
import questionnareReducer from '../../containers/questionnaire/QuestionnaireReducer';
import studiesReducer from '../../containers/study/reducers';
import timeUseDiaryReducer from '../../containers/tud/TimeUseDiaryReducer';
import {
  APP,
  APP_USAGE_SURVEY,
  AUTH,
  ORGANIZATIONS,
  PERMISSIONS,
  STUDIES,
} from '../../common/constants';

export default function reduxReducer(routerHistory :any) {

  return combineReducers({
    [APP]: appReducer,
    [APP_USAGE_SURVEY]: appUsageSurveyReducer,
    [AUTH]: authReducer,
    [ORGANIZATIONS]: orgsReducer,
    [PERMISSIONS]: permissionsReducer,
    [STUDIES]: studiesReducer,
    dashboard: dashboardReducer,
    edm: edmReducer,
    questionnaire: questionnareReducer,
    router: connectRouter(routerHistory),
    tud: timeUseDiaryReducer,
  });
}
