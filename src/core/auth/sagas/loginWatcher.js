/*
 * @flow
 */

import { put, take } from '@redux-saga/core/effects';
import { push } from 'connected-react-router';
import type { Saga } from '@redux-saga/core';

import { LOGIN as LOGIN_PATH } from '../../router/Routes';
import { LOGIN } from '../actions';

export default function* loginWatcher() :Saga<void> {

  while (true) {
    yield take(LOGIN);
    yield put(push(LOGIN_PATH));
  }
}
