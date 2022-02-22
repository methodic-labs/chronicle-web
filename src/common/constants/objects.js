/*
 * @flow
 */
import { RequestStates } from 'redux-reqseq';

import {
  ERROR,
  REQUEST_STATE,
} from './strings';

import type { AppUsageFreqType, PermissionTypesEnum } from '../types';

export const AppUsageFreqTypes :{| ...AppUsageFreqType |} = Object.freeze({
  HOURLY: 'HOURLY',
  DAILY: 'DAILY'
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
