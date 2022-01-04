// @flow
import type { ComponentType } from 'react';

import { AuthUtils } from 'lattice-auth';

import DefaultUnauthorized from './DefaultUnauthorized';

type Props = {
  unauthorizedComponent :ComponentType<any>;
  children :React$Node;
};

const Auth0AdminRoute = (props :Props) => {
  const {
    unauthorizedComponent: UnauthorizedComponent,
    children,
  } = props;

  const isAuthorized = AuthUtils.isAdmin();

  return isAuthorized ? children : <UnauthorizedComponent />;
};

Auth0AdminRoute.defaultProps = {
  unauthorizedComponent: DefaultUnauthorized
};

export default Auth0AdminRoute;
