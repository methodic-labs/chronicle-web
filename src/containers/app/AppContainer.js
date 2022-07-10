/*
 * @flow
 */

import { useEffect } from 'react';

import _isFunction from 'lodash/isFunction';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  AppNavigationWrapper,
  Spinner,
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import {
  NavLink,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { INITIALIZE_APPLICATION, initializeApplication } from './actions';

import Auth0AdminRoute from '../../core/router/Auth0AdminRoute';
import ContactSupportButton from '../shared/ContactSupportButton';
import DashboardContainer from '../dashboard/DashboardContainer';
import StudiesContainer from '../study/StudiesContainer';
import StudyRouter from '../study/StudyRouter';
import * as Routes from '../../core/router/Routes';
import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import { BasicErrorComponent } from '../../common/components';
import { isNonEmptyString, useRequestState } from '../../common/utils';
import { logout } from '../../core/auth/actions';
import { getUserInfo, isAdmin } from '../../core/auth/utils';
import { GOOGLE_MEASUREMENT_ID } from '../../core/tracking/google/GoogleAnalytics';

declare var gtag :?Function;

const AppContainer = () => {
  const dispatch = useDispatch();

  const initializeApplicationRS :?RequestState = useRequestState(['app', INITIALIZE_APPLICATION]);

  useEffect(() => {
    dispatch(initializeApplication());
  }, [dispatch]);

  const onLogout = () => {
    dispatch(logout());
    if (_isFunction(gtag)) {
      gtag('config', GOOGLE_MEASUREMENT_ID, { user_id: undefined, send_page_view: false });
    }
  };

  const renderAppContent = () => {
    if (initializeApplicationRS === RequestStates.SUCCESS) {
      return (
        <Switch>
          <Route path={Routes.STUDY} component={StudyRouter} />
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

  const userInfo = getUserInfo() || {};
  let user = null;
  if (isNonEmptyString(userInfo.name)) {
    user = userInfo.name;
  }
  else if (isNonEmptyString(userInfo.email)) {
    user = userInfo.email;
  }

  return (
    <AppContainerWrapper>
      <AppHeaderWrapper
          appIcon={OpenLatticeIconSVG}
          appTitle="Chronicle"
          logout={onLogout}
          user={user}>
        <AppNavigationWrapper>
          <NavLink to={Routes.STUDIES} />
          <NavLink to={Routes.STUDIES}> Studies </NavLink>
          { isAdmin() && <NavLink to={Routes.DASHBOARD}>Dashboard</NavLink>}
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
