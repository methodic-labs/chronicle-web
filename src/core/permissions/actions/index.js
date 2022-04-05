/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_AUTHORIZATIONS :'GET_AUTHORIZATIONS' = 'GET_AUTHORIZATIONS';
const getAuthorizations :RequestSequence = newRequestSequence(GET_AUTHORIZATIONS);

export {
  GET_AUTHORIZATIONS,
  getAuthorizations,
};
