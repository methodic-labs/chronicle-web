/*
 * @flow
 */

/* eslint-disable max-len */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ORGANIZATIONS :'GET_ORGANIZATIONS' = 'GET_ORGANIZATIONS';
const getOrganizations :RequestSequence = newRequestSequence(GET_ORGANIZATIONS);

export {
  GET_ORGANIZATIONS,
  getOrganizations,
};
