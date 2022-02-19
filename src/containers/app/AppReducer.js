// /*
//  * @flow
//  */
//
// import { Map, fromJS } from 'immutable';
// import { ReduxConstants } from 'lattice-utils';
// import { RequestStates } from 'redux-reqseq';
//
// import { getOrganizationId } from '../../common/utils';
// import { RESET_REQUEST_STATE } from '../../core/redux/ReduxActions';
// import { APP_REDUX_CONSTANTS } from '../../utils/constants/ReduxConstants';
//
// const { REQUEST_STATE } = ReduxConstants;
// const {
//   APP_MODULES_ORG_LIST_MAP,
//   ENTITY_SET_IDS_BY_ORG_ID,
//   ORGS,
//   SELECTED_ORG_ID,
//   SETTINGS,
// } = APP_REDUX_CONSTANTS;
//
// const INITIAL_STATE :Map<*, *> = fromJS({
//   [GET_APP_SETTINGS]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [GET_CONFIGS]: { [REQUEST_STATE]: RequestStates.STANDBY },
//
//   // state
//   [APP_MODULES_ORG_LIST_MAP]: Map(),
//   [ENTITY_SET_IDS_BY_ORG_ID]: Map(),
//   [ORGS]: Map(),
//   [SELECTED_ORG_ID]: '',
//   [SETTINGS]: Map()
// });
//
// export default function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {
//
//   switch (action.type) {
//
//     case RESET_REQUEST_STATE: {
//       const { actionType } = action;
//       if (actionType && state.has(actionType)) {
//         return state.setIn([actionType, REQUEST_STATE], RequestStates.STANDBY);
//       }
//       return state;
//     }
//
//     case getConfigs.case(action.type): {
//       return getConfigs.reducer(state, action, {
//         REQUEST: () => state.setIn([GET_CONFIGS, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([GET_CONFIGS, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const {
//             appModulesOrgListMap,
//             entitySetIdsByOrgId,
//             organizations,
//           } = action.value;
//
//           let selectedOrgId = Object.keys(organizations)[0];
//
//           const storedOrgId = getOrganizationId();
//           if (storedOrgId && organizations[storedOrgId]) {
//             selectedOrgId = storedOrgId;
//           }
//
//           return state
//             .set(ENTITY_SET_IDS_BY_ORG_ID, fromJS(entitySetIdsByOrgId))
//             .set(SELECTED_ORG_ID, selectedOrgId)
//             .set(ORGS, fromJS(organizations))
//             .set(APP_MODULES_ORG_LIST_MAP, fromJS(appModulesOrgListMap))
//             .setIn([GET_CONFIGS, REQUEST_STATE], RequestStates.PENDING);
//         }
//       });
//     }
//
//     case getAppSettings.case(action.type): {
//       return getAppSettings.reducer(state, action, {
//         REQUEST: () => state
//           .setIn([GET_APP_SETTINGS, REQUEST_STATE], RequestStates.PENDING)
//           .setIn([GET_APP_SETTINGS, action.id], action),
//         FAILURE: () => state.setIn([GET_APP_SETTINGS, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const { appName, organizationId, settings } = action.value;
//
//           return state
//             .setIn([GET_APP_SETTINGS, REQUEST_STATE], RequestStates.SUCCESS)
//             .setIn([SETTINGS, appName, organizationId], fromJS(settings));
//         },
//         FINALLY: () => state.deleteIn([GET_APP_SETTINGS, action.id])
//       });
//     }
//
//     default:
//       return state;
//   }
// }
