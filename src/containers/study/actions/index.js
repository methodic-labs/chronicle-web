/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CHANGE_ENROLLMENT_STATUS :'CHANGE_ENROLLMENT_STATUS' = 'CHANGE_ENROLLMENT_STATUS';
const changeEnrollmentStatus :RequestSequence = newRequestSequence(CHANGE_ENROLLMENT_STATUS);

const CREATE_STUDY :'CREATE_STUDY' = 'CREATE_STUDY';
const createStudy :RequestSequence = newRequestSequence(CREATE_STUDY);

const DELETE_STUDY :'DELETE_STUDY' = 'DELETE_STUDY';
const deleteStudy :RequestSequence = newRequestSequence(DELETE_STUDY);

const DELETE_STUDY_PARTICIPANTS :'DELETE_STUDY_PARTICIPANTS' = 'DELETE_STUDY_PARTICIPANTS';
const deleteStudyParticipants :RequestSequence = newRequestSequence(DELETE_STUDY_PARTICIPANTS);

const GET_ALL_STUDIES :'GET_ALL_STUDIES' = 'GET_ALL_STUDIES';
const getAllStudies :RequestSequence = newRequestSequence(GET_ALL_STUDIES);

const GET_ORG_STUDIES :'GET_ORG_STUDIES' = 'GET_ORG_STUDIES';
const getOrgStudies :RequestSequence = newRequestSequence(GET_ORG_STUDIES);

const GET_PARTICIPANT_STATS :'GET_PARTICIPANT_STATS' = 'GET_PARTICIPANT_STATS';
const getParticipantStats :RequestSequence = newRequestSequence(GET_PARTICIPANT_STATS);

const GET_STUDY :'GET_STUDY' = 'GET_STUDY';
const getStudy :RequestSequence = newRequestSequence(GET_STUDY);

const GET_STUDY_PARTICIPANTS :'GET_STUDY_PARTICIPANTS' = 'GET_STUDY_PARTICIPANTS';
const getStudyParticipants :RequestSequence = newRequestSequence(GET_STUDY_PARTICIPANTS);

const GET_STUDY_SETTINGS :'GET_STUDY_SETTINGS' = 'GET_STUDY_SETTINGS';
const getStudySettings :RequestSequence = newRequestSequence(GET_STUDY_SETTINGS);

const INITIALIZE_STUDY :'INITIALIZE_STUDY' = 'INITIALIZE_STUDY';
const initializeStudy :RequestSequence = newRequestSequence(INITIALIZE_STUDY);

const REGISTER_PARTICIPANT :'REGISTER_PARTICIPANT' = 'REGISTER_PARTICIPANT';
const registerParticipant :RequestSequence = newRequestSequence(REGISTER_PARTICIPANT);

const REMOVE_STUDY_ON_DELETE :'REMOVE_STUDY_ON_DELETE' = 'REMOVE_STUDY_ON_DELETE';
const removeStudyOnDelete = (studyId :UUID) => ({
  type: REMOVE_STUDY_ON_DELETE,
  studyId
});

const UPDATE_STUDY :'UPDATE_STUDY' = 'UPDATE_STUDY';
const updateStudy :RequestSequence = newRequestSequence(UPDATE_STUDY);

const VERIFY_PARTICIPANT :'VERIFY_PARTICIPANT' = 'VERIFY_PARTICIPANT';
const verifyParticipant :RequestSequence = newRequestSequence(VERIFY_PARTICIPANT);

export {
  CHANGE_ENROLLMENT_STATUS,
  CREATE_STUDY,
  DELETE_STUDY,
  DELETE_STUDY_PARTICIPANTS,
  GET_ALL_STUDIES,
  GET_ORG_STUDIES,
  GET_PARTICIPANT_STATS,
  GET_STUDY,
  GET_STUDY_PARTICIPANTS,
  GET_STUDY_SETTINGS,
  INITIALIZE_STUDY,
  REGISTER_PARTICIPANT,
  REMOVE_STUDY_ON_DELETE,
  UPDATE_STUDY,
  VERIFY_PARTICIPANT,
  changeEnrollmentStatus,
  createStudy,
  deleteStudy,
  deleteStudyParticipants,
  getAllStudies,
  getOrgStudies,
  getParticipantStats,
  getStudy,
  getStudyParticipants,
  getStudySettings,
  initializeStudy,
  registerParticipant,
  removeStudyOnDelete,
  updateStudy,
  verifyParticipant,
};
