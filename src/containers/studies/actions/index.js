/*
 * @flow
 */

/* eslint-disable max-len */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CREATE_STUDY :'CREATE_STUDY' = 'CREATE_STUDY';
const createStudy :RequestSequence = newRequestSequence(CREATE_STUDY);

const GET_ALL_STUDIES :'GET_ALL_STUDIES' = 'GET_ALL_STUDIES';
const getAllStudies :RequestSequence = newRequestSequence(GET_ALL_STUDIES);

const GET_STUDY_SETTINGS :'GET_STUDY_SETTINGS' = 'GET_STUDY_SETTINGS';
const getStudySettings :RequestSequence = newRequestSequence(GET_STUDY_SETTINGS);

const GET_ORG_STUDIES :'GET_ORG_STUDIES' = 'GET_ORG_STUDIES';
const getOrgStudies :RequestSequence = newRequestSequence(GET_ORG_STUDIES);

const UPDATE_STUDY :'UPDATE_STUDY' = 'UPDATE_STUDY';
const updateStudy :RequestSequence = newRequestSequence(UPDATE_STUDY);

export {
  CREATE_STUDY,
  GET_ALL_STUDIES,
  GET_ORG_STUDIES,
  GET_STUDY_SETTINGS,
  UPDATE_STUDY,
  createStudy,
  getAllStudies,
  getOrgStudies,
  getStudySettings,
  updateStudy,
};
