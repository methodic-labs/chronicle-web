/*
 * @flow
 */

import { take } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';

import { configure, getConfig } from '../../config/Configuration';
import { AUTH_SUCCESS } from '../actions';
import { getCSRFToken } from '../utils';

export default function* authSuccessWatcher() :Saga<void> {

  while (true) {
    const { authToken } = yield take(AUTH_SUCCESS);
    /*
     * AUTH_SUCCESS will be dispatched in one of two possible scenarios:
     *
     *   1. the user is not authenticated, which means the Auth0 id token either is not stored locally or is expired.
     *      in this scenario, AUTH_ATTEMPT *will* be dispatched, which means AuthUtils.storeAuthInfo() and
     *      Lattice.configure() will have already been invoked, so we don't need to do anything else here.
     *
     *   2. the user is already authenticated, which means the Auth0 id token is already stored locally, which means
     *      we don't need to dispatch AUTH_ATTEMPT, which means AuthRoute is able to pass along the Auth0 id token
     *      via componentWillMount(). in this scenario, AUTH_ATTEMPT *will not* be dispatched, but we still need
     *      to invoke Lattice.configure().
     */
    if (authToken) {
      configure({
        authToken,
        baseUrl: getConfig().get('baseUrl'),
        csrfToken: getCSRFToken(),
      });
    }
  }
}
