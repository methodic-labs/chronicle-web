/*
 * @flow
 */
import { RequestStates } from 'redux-reqseq';

import {
  ERROR,
  REQUEST_STATE,
} from './strings';

export const RS_INITIAL_STATE = {
  [ERROR]: false,
  [REQUEST_STATE]: RequestStates.STANDBY,
};
