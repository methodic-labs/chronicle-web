// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ALL_STUDIES_TABLE_DATA :'GET_ALL_STUDIES_TABLE_DATA' = 'GET_ALL_STUDIES_TABLE_DATA';
const getAllStudiesTableData :RequestSequence = newRequestSequence(GET_ALL_STUDIES_TABLE_DATA);

export {
  GET_ALL_STUDIES_TABLE_DATA,
  getAllStudiesTableData,
};
