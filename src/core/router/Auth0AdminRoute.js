/*
 * @flow
 */

import type { ComponentType } from 'react';

import DefaultUnauthorized from './DefaultUnauthorized';

import { isAdmin } from '../auth/utils';

type Props = {
  unauthorizedComponent :ComponentType<any>;
  children :React$Node;
};

const Auth0AdminRoute = (props :Props) => {
  const {
    unauthorizedComponent: UnauthorizedComponent,
    children,
  } = props;

  const isAuthorized = isAdmin();

  return isAuthorized ? children : <UnauthorizedComponent />;
};

Auth0AdminRoute.defaultProps = {
  unauthorizedComponent: DefaultUnauthorized
};

export default Auth0AdminRoute;
