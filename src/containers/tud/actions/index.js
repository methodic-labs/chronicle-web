/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_TIME_USE_DIARY :'SUBMIT_TIME_USE_DIARY' = 'SUBMIT_TIME_USE_DIARY';
const submitTimeUseDiary :RequestSequence = newRequestSequence(SUBMIT_TIME_USE_DIARY);

export {
  SUBMIT_TIME_USE_DIARY,
  submitTimeUseDiary,
};
