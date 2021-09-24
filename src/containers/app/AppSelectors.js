// @flow

import { List, Map } from 'immutable';
import { createSelector } from 'reselect';

import { DATA_COLLECTION, QUESTIONNAIRES } from '../../utils/constants/AppModules';
import { APP_REDUX_CONSTANTS, REDUCERS } from '../../utils/constants/ReduxConstants';

const { APP } = REDUCERS;
const { SELECTED_ORG_ID, APP_MODULES_ORG_LIST_MAP } = APP_REDUX_CONSTANTS;

const currentOrgIdSelector = (state :Map) => state.getIn([APP, SELECTED_ORG_ID]);

const appModulesSelector = (state :Map) => state.getIn([APP, APP_MODULES_ORG_LIST_MAP], Map());

// $FlowFixMe
const orgHasSurveyModuleSelector = createSelector(
  currentOrgIdSelector,
  appModulesSelector,
  (orgId :UUID, appModules :Map) => appModules.get(QUESTIONNAIRES, List()).includes(orgId)
);

// $FlowFixMe
const orgHasDataCollectionModuleSelector = createSelector(
  currentOrgIdSelector,
  appModulesSelector,
  (orgId :UUID, appModules :Map) => appModules.get(DATA_COLLECTION, List()).includes(orgId)
);

export {
  orgHasDataCollectionModuleSelector,
  currentOrgIdSelector,
  orgHasSurveyModuleSelector,
};
