/*
 * @flow
 */

import { useEffect } from 'react';

import _isFunction from 'lodash/isFunction';
import { Map } from 'immutable';
import { AuthActions, AuthUtils } from 'lattice-auth';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  AppNavigationWrapper,
  Spinner,
} from 'lattice-ui-kit';
import { LangUtils, useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavLink,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { INITIALIZE_APPLICATION, initializeApplication, switchOrganization } from './AppActions';

import Auth0AdminRoute from '../../core/router/Auth0AdminRoute';
import BasicErrorComponent from '../shared/BasicErrorComponent';
import ContactSupportButton from '../shared/ContactSupportButton';
import DashboardContainer from '../dashboard/DashboardContainer';
import OpenLatticeIcon from '../../assets/images/ol_icon.png';
import StudiesContainer from '../studies/StudiesContainer';
import StudyDetailsContainer from '../study/StudyDetailsContainer';
import * as Routes from '../../core/router/Routes';
import { GOOGLE_TRACKING_ID } from '../../core/tracking/google/GoogleAnalytics';
import { APP_REDUX_CONSTANTS } from '../../utils/constants/ReduxConstants';

declare var gtag :?Function;

const { isNonEmptyString } = LangUtils;

const { ORGS, SELECTED_ORG_ID } = APP_REDUX_CONSTANTS;

const AppContainer = () => {
  const dispatch = useDispatch();

  const initializeApplicationRS :?RequestState = useRequestState(['app', INITIALIZE_APPLICATION]);

  const organizations :Map = useSelector((state) => state.getIn(['app', ORGS], Map()));
  const selectedOrgId :string = useSelector((state) => state.getIn(['app', SELECTED_ORG_ID]));

  useEffect(() => {
    dispatch(initializeApplication());
  }, [dispatch]);

  const logout = () => {
    dispatch(AuthActions.logout());
    if (_isFunction(gtag)) {
      gtag('config', GOOGLE_TRACKING_ID, { user_id: undefined, send_page_view: false });
    }
  };

  const renderAppContent = () => {
    if (initializeApplicationRS === RequestStates.SUCCESS) {
      return (
        <Switch>
          <Route path={Routes.STUDY}>
            <StudyDetailsContainer />
          </Route>
          <Route path={Routes.STUDIES}>
            <StudiesContainer />
          </Route>
          <Route
              path={Routes.DASHBOARD}
              render={() => (
                <Auth0AdminRoute>
                  <DashboardContainer />
                </Auth0AdminRoute>
              )} />
          <Route render={() => <Redirect to={Routes.STUDIES} />} />
        </Switch>
      );
    }

    return (
      <AppContentWrapper>
        {
          initializeApplicationRS === RequestStates.FAILURE
            ? <BasicErrorComponent />
            : <Spinner size="2x" />
        }
      </AppContentWrapper>
    );
  };

  const userInfo = AuthUtils.getUserInfo() || {};
  let user = null;
  if (isNonEmptyString(userInfo.name)) {
    user = userInfo.name;
  }
  else if (isNonEmptyString(userInfo.email)) {
    user = userInfo.email;
  }

  const handleSwitchOrganization = (organization :Object) => {
    if (organization.value !== selectedOrgId) {
      dispatch(switchOrganization(organization.value));
    }
  };

  return (
    <AppContainerWrapper>
      <AppHeaderWrapper
          appIcon={OpenLatticeIcon}
          appTitle="Chronicle"
          logout={logout}
          organizationsSelect={{
            isLoading: initializeApplicationRS === RequestStates.PENDING,
            onChange: handleSwitchOrganization,
            organizations,
            selectedOrganizationId: selectedOrgId
          }}
          user={user}>
        <AppNavigationWrapper>
          <NavLink to={Routes.STUDIES} />
          <NavLink to={Routes.STUDIES}> Studies </NavLink>
          { AuthUtils.isAdmin() && <NavLink to={Routes.DASHBOARD}>Dashboard</NavLink>}
        </AppNavigationWrapper>
      </AppHeaderWrapper>
      <AppContentWrapper>
        { renderAppContent() }
      </AppContentWrapper>
      <ContactSupportButton />
    </AppContainerWrapper>
  );
};

// $FlowFixMe
export default AppContainer;
