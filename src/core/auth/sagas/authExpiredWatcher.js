/*
 * @flow
 */

import { call, take } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';

import { AUTH_EXPIRED } from '../actions';
import { clearAuthInfo } from '../utils';

export default function* authExpiredWatcher() :Saga<void> {

  while (true) {
    yield take(AUTH_EXPIRED);
    yield call(clearAuthInfo);
  }
}
