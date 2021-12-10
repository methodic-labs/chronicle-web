// @flow
import type { ComponentType } from 'react';

import { AuthUtils } from 'lattice-auth';
import { Route } from 'react-router-dom';

import DefaultUnauthorized from './DefaultUnauthorized';

type Props = {
  component :ComponentType<any>;
  unauthorizedComponent :ComponentType<any>;
};

const Auth0AdminRoute = (props :Props) => {
  const {
    component: Component,
    unauthorizedComponent: UnauthorizedComponent,
    ...rest
  } = props;

  const isAuthorized = AuthUtils.isAdmin();

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    // $FlowIgnore
    <Route
        {...rest} // eslint-disable-line indent
        render={(ownProps :any) => (isAuthorized
          ? <Component {...ownProps} />
          : <UnauthorizedComponent />)} />
    /* eslint-enable */
  );
};

Auth0AdminRoute.defaultProps = {
  unauthorizedComponent: DefaultUnauthorized
};

export default Auth0AdminRoute;
