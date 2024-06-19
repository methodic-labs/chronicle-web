/*
 * @flow
 */

import { useEffect } from 'react';

import { faPenField } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _isFunction from 'lodash/isFunction';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  AppNavigationWrapper,
  IconButton,
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
import styled from 'styled-components';
import type { RequestState } from 'redux-reqseq';

import { INITIALIZE_APPLICATION, initializeApplication } from './actions';

import Auth0AdminRoute from '../../core/router/Auth0AdminRoute';
import DashboardContainer from '../dashboard/DashboardContainer';
import StudiesContainer from '../study/StudiesContainer';
import StudyRouter from '../study/StudyRouter';
import * as Routes from '../../core/router/Routes';
import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import { BasicErrorComponent, ContactSupportButton } from '../../common/components';
import { copyToClipboard, isNonEmptyString, useRequestState } from '../../common/utils';
import { logout } from '../../core/auth/actions';
import { getAuthToken, getUserInfo, isAdmin } from '../../core/auth/utils';
import { GOOGLE_MEASUREMENT_ID } from '../../core/tracking/google/GoogleAnalytics';

declare var gtag :?Function;

const CopyTokenWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0px 0px 0px 30px;

  svg {
    margin-top: -4px;
  }
`;

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
          <CopyTokenWrapper>
            <IconButton onClick={() => copyToClipboard(getAuthToken())} title="copy auth0 token">
              <FontAwesomeIcon icon={faPenField} />
            </IconButton>
          </CopyTokenWrapper>
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
