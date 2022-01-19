// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SEND_MESSAGE :'SEND_MESSAGE' = 'SEND_MESSAGE';
const sendMessage :RequestSequence = newRequestSequence(SEND_MESSAGE);

export {
  SEND_MESSAGE,
  sendMessage
};
