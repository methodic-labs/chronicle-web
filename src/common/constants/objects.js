/*
 * @flow
 */
import { RequestStates } from 'redux-reqseq';

import {
  ERROR,
  REQUEST_STATE,
} from './strings';

import type {
  AppComponent,
  AppUsageFreqType,
  ParticipationStatusesEnum,
  PermissionTypesEnum
} from '../types';

export const AppUsageFreqTypes :{| ...AppUsageFreqType |} = Object.freeze({
  HOURLY: 'HOURLY',
  DAILY: 'DAILY'
});

export const AppComponents :{|...AppComponent |} = Object.freeze({
  CHRONICLE: 'CHRONICLE',
  CHRONICLE_DATA_COLLECTION: 'CHRONICLE_DATA_COLLECTION',
  CHRONICLE_SURVEYS: 'CHRONICLE_SURVEYS',
  TIME_USE_DIARY: 'TIME_USE_DIARY'
});

export const ParticipationStatuses :{| ...ParticipationStatusesEnum |} = Object.freeze({
  ENROLLED: 'ENROLLED',
  NOT_ENROLLED: 'NOT_ENROLLED',
  PAUSED: 'PAUSED',
  UNKNOWN: 'UNKNOWN',
});

export const PermissionTypes :{| ...PermissionTypesEnum |} = Object.freeze({
  DISCOVER: 'DISCOVER',
  INTEGRATE: 'INTEGRATE',
  LINK: 'LINK',
  MATERIALIZE: 'MATERIALIZE',
  OWNER: 'OWNER',
  READ: 'READ',
  WRITE: 'WRITE',
});

export const RS_INITIAL_STATE = {
  [ERROR]: false,
  [REQUEST_STATE]: RequestStates.STANDBY,
};
