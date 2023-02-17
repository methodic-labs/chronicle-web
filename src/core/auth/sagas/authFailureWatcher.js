/*
 * @flow
 */

import { call, take } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';

import { AUTH_FAILURE } from '../actions';
import { clearAuthInfo } from '../utils';

export default function* authFailureWatcher() :Saga<void> {

  while (true) {
    yield take(AUTH_FAILURE);
    yield call(clearAuthInfo);
  }
}
