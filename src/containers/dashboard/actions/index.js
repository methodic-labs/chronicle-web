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

const COUNT_ALL_STUDIES :'COUNT_ALL_STUDIES' = 'COUNT_ALL_STUDIES';
const countAllStudies :RequestSequence = newRequestSequence(COUNT_ALL_STUDIES);

const COUNT_ALL_PARTICIPANTS :'COUNT_ALL_PARTICIPANTS' = 'COUNT_ALL_PARTICIPANTS';
const countAllParticipants :RequestSequence = newRequestSequence(COUNT_ALL_PARTICIPANTS);

const GET_SUMMARY_STATS :'GET_SUMMARY_STATS' = 'GET_SUMMARY_STATS';
const getSummaryStats :RequestSequence = newRequestSequence(GET_SUMMARY_STATS);

export {
  COUNT_ALL_PARTICIPANTS,
  COUNT_ALL_STUDIES,
  GET_ALL_STUDIES_TABLE_DATA,
  GET_ORG_STUDIES,
  GET_ORG_STUDIES_TABLE_DATA,
  GET_STUDY_PARTICIPANTS_COUNT,
  GET_SUMMARY_STATS,
  countAllParticipants,
  countAllStudies,
  getAllStudiesTableData,
  getOrgStudies,
  getOrgStudiesTableData,
  getStudyParticipantsCount,
  getSummaryStats,
};
