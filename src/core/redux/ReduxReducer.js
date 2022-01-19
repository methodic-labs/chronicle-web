/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import dashboardReducer from '../../containers/dashboard/reducers';
import edmReducer from '../edm/EDMReducer';
import messageReducer from '../../containers/message/reducers';
import permissionsReducer from '../permissions/PermissionsReducer';
import questionnareReducer from '../../containers/questionnaire/QuestionnaireReducer';
import studiesReducer from '../../containers/studies/StudiesReducer';
import surveyReducer from '../../containers/survey/SurveyReducer';
import timeUseDiaryReducer from '../../containers/tud/TimeUseDiaryReducer';

export default function reduxReducer(routerHistory :any) {

  return combineReducers({
    app: appReducer,
    appsData: surveyReducer,
    auth: AuthReducer,
    dashboard: dashboardReducer,
    edm: edmReducer,
    message: messageReducer,
    permissions: permissionsReducer,
    questionnaire: questionnareReducer,
    router: connectRouter(routerHistory),
    studies: studiesReducer,
    tud: timeUseDiaryReducer,
  });
}
