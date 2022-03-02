// @flow

import axios from 'axios';
import { Types } from 'lattice';

import { getAuthToken } from '../../core/auth/utils';
import {
  getDeleteParticipantPath,
  getDeleteStudyUrl,
  getQuestionnaireUrl,
  getStudySettingsUrl,
  getSubmitQuestionnaireUrl,
} from '../AppUtils';

const { DeleteTypes } = Types;

const CAFE_ORG_ID :UUID = '7349c446-2acc-4d14-b2a9-a13be39cff93';

// delete a participant and neighbors
function deleteStudyParticipant(orgId :UUID = CAFE_ORG_ID, participantId :string, studyId :UUID) {
  return new Promise<*>((resolve, reject) => {

    const url = getDeleteParticipantPath(orgId, participantId, studyId);
    if (!url) return reject(new Error('Invalid Url'));

    const authToken = getAuthToken() ?? '';

    return axios({
      method: 'delete',
      url: encodeURI(url),
      headers: { Authorization: `Bearer ${authToken}` },
      params: { type: DeleteTypes.HARD }
    }).then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

/*
 * 'GET chronicle/study/<studyId>/questionnaire/<questionnaireEKID>'
 *
 * Retrieve questionnaire details and associated questions
 * response data:
   {
     questionnaireDetails: {
       FQN1: [value1],
       FQN2: [value2]
     },
     questions: [
        {
          FQN3 [value]
          FQN4: [value]
        }
     ]
   }
 */
function getQuestionnaire(orgId :UUID = CAFE_ORG_ID, studyId :UUID, questionnaireEKID :UUID) {
  return new Promise<*>((resolve, reject) => {
    const url = getQuestionnaireUrl(orgId, studyId, questionnaireEKID);
    if (!url) return reject(new Error('Invalid url'));

    return axios({
      method: 'get',
      url
    }).then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

function submitQuestionnaire(
  orgId :UUID = CAFE_ORG_ID, studyId :UUID, participantId :UUID, questionAnswerMapping :Object
) {
  return new Promise<*>((resolve, reject) => {
    const url = getSubmitQuestionnaireUrl(orgId, studyId, participantId);
    if (!url) return reject(new Error('Invalid url'));

    return axios({
      method: 'post',
      url: encodeURI(url),
      data: questionAnswerMapping
    }).then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

function deleteStudy(orgId :UUID, studyId :UUID) {
  return new Promise<*>((resolve, reject) => {

    const url = getDeleteStudyUrl(orgId, studyId);
    if (!url) return reject(new Error('Invalid url'));

    const authToken = getAuthToken() || '';

    return axios({
      headers: { Authorization: `Bearer ${authToken}` },
      method: 'delete',
      params: { type: DeleteTypes.HARD },
      url,
    }).then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

function getStudySettings(studyId :UUID) {
  return new Promise<*>((resolve, reject) => {
    const url = getStudySettingsUrl(studyId);
    if (!url) return reject(new Error('invalid url'));

    return axios({
      method: 'get',
      url,
    }).then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

export {
  deleteStudy,
  deleteStudyParticipant,
  getQuestionnaire,
  getStudySettings,
  submitQuestionnaire,
};
