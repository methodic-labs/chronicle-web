/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_STUDY :'GET_STUDY' = 'GET_STUDY';
const getStudy :RequestSequence = newRequestSequence(GET_STUDY);

const GET_STUDY_PARTICIPANTS :'GET_STUDY_PARTICIPANTS' = 'GET_STUDY_PARTICIPANTS';
const getStudyParticipants :RequestSequence = newRequestSequence(GET_STUDY_PARTICIPANTS);

const INITIALIZE_STUDY :'INITIALIZE_STUDY' = 'INITIALIZE_STUDY';
const initializeStudy :RequestSequence = newRequestSequence(INITIALIZE_STUDY);

export {
  GET_STUDY,
  GET_STUDY_PARTICIPANTS,
  INITIALIZE_STUDY,
  getStudy,
  getStudyParticipants,
  initializeStudy,
};
