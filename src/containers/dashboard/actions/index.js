// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ALL_STUDIES_TABLE_DATA :'GET_ALL_STUDIES_TABLE_DATA' = 'GET_ALL_STUDIES_TABLE_DATA';
const getAllStudiesTableData :RequestSequence = newRequestSequence(GET_ALL_STUDIES_TABLE_DATA);

const GET_ORG_STUDIES_TABLE_DATA :'GET_ORG_STUDIES_TABLE_DATA' = 'GET_ORG_STUDIES_TABLE_DATA';
const getOrgStudiesTableData :RequestSequence = newRequestSequence(GET_ORG_STUDIES_TABLE_DATA);

const GET_ORG_STUDIES :'GET_ORG_STUDIES' = 'GET_ORG_STUDIES';
const getOrgStudies :RequestSequence = newRequestSequence(GET_ORG_STUDIES);

const GET_STUDY_PARTICIPANTS_COUNT :'GET_STUDY_PARTICIPANTS_COUNT' = 'GET_STUDY_PARTICIPANTS_COUNT';
const getStudyParticipantsCount :RequestSequence = newRequestSequence(GET_STUDY_PARTICIPANTS_COUNT);

export {
  GET_ALL_STUDIES_TABLE_DATA,
  GET_ORG_STUDIES,
  GET_ORG_STUDIES_TABLE_DATA,
  GET_STUDY_PARTICIPANTS_COUNT,
  getAllStudiesTableData,
  getOrgStudies,
  getOrgStudiesTableData,
  getStudyParticipantsCount,
};
