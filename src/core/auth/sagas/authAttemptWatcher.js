/*
 * @flow
 */

import qs from 'qs';
import { call, put, take } from '@redux-saga/core/effects';
import { push } from 'connected-react-router';
import { v4 as uuid } from 'uuid';
import type { Saga } from '@redux-saga/core';

import * as Auth0 from '../Auth0';
import { Logger, isNonEmptyString } from '../../../common/utils';
import { syncUser } from '../../api/principal';
import { configure, getConfig } from '../../config/Configuration';
import { AUTH_ATTEMPT, authFailure, authSuccess } from '../actions';
import {
  clearNonceState,
  getCSRFToken,
  getNonceState,
  storeAuthInfo,
  storeNonceState,
} from '../utils';

const LOG = new Logger('AuthSagas');

export default function* authAttemptWatcher() :Saga<void> {

  while (true) {
    yield take(AUTH_ATTEMPT);
    try {
      const { authInfo, state } = yield call(Auth0.authenticate);
      /*
       * our attempt to authenticate has succeeded. now, we need to store the Auth0 id token and configure lattice
       * before dispatching AUTH_SUCCESS in order to guarantee that AuthRoute will receive the correct props in the
       * next pass through its lifecycle.
       */
      storeAuthInfo(authInfo);
      configure({
        authToken: authInfo.idToken,
        baseUrl: getConfig().get('baseUrl'),
        csrfToken: getCSRFToken(),
      });
      yield call(syncUser);

      const nonce = getNonceState(state);
      if (nonce && nonce.redirectUrl) {
        const redirectUrl = new URL(nonce.redirectUrl);
        yield put(push(redirectUrl.hash.slice(1)));
        clearNonceState();
      }

      yield put(authSuccess());
    }
    catch (error) {
      LOG.error(AUTH_ATTEMPT, error);
      // TODO: need better error handling depending on the error that comes through
      yield put(authFailure(error));

      let auth0NonceState :?string;
      try {
        auth0NonceState = uuid();
        const { redirectUrl } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        if (isNonEmptyString(redirectUrl)) {
          storeNonceState(auth0NonceState, { redirectUrl: (redirectUrl :any) });
        }
      }
      catch (error2) {
        LOG.error(AUTH_ATTEMPT, error2);
      }
      Auth0.getAuth0LockInstance().show({ auth: { params: { state: auth0NonceState } } });
    }
  }
}
