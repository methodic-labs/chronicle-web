/*
 * @flow
 */

import { put, take } from '@redux-saga/core/effects';
import { push } from 'connected-react-router';
import type { Saga } from '@redux-saga/core';

import { ROOT } from '../../router/Routes';
import { LOGOUT } from '../actions';
import { clearAuthInfo } from '../utils';

export default function* logoutWatcher() :Saga<void> {

  while (true) {
    yield take(LOGOUT);
    clearAuthInfo();
    yield put(push(ROOT));
  }
}
