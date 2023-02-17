/*
 * @flow
 */

const STUDY_ID_PARAM :':studyId' = ':studyId';

export {
  STUDY_ID_PARAM,
};

const DASHBOARD :'/dashboard' = '/dashboard';
const LOGIN :'/login' = '/login';
const NO_ROUTE :'#' = '#';
const QUESTIONNAIRE :'/questionnaire' = '/questionnaire';
const ROOT :'/' = '/';
const STUDIES :'/studies' = '/studies';
const SURVEY :'/survey' = '/survey';
const TUD :'/time-use-diary' = '/time-use-diary';

// $FlowFixMe - ignoring flow because I prefer the code hints to show the value
const STUDY :'/studies/:studyId' = `${STUDIES}/${STUDY_ID_PARAM}`;

// $FlowFixMe - ignoring flow because I prefer the code hints to show the value
const PARTICIPANTS :'/studies/:studyId/participants' = `${STUDY}/participants`;

// $FlowFixMe - ignoring flow because I prefer the code hints to show the value
const QUESTIONNAIRES :'/studies/:studyId/questionnaires' = `${STUDY}/questionnaires`;

// $FlowFixMe - ignoring flow because I prefer the code hints to show the value
const STUDY_TUD :'/studies/:studyId/time-use-diary' = `${STUDY}${TUD}`;

export {
  DASHBOARD,
  LOGIN,
  NO_ROUTE,
  PARTICIPANTS,
  QUESTIONNAIRE,
  QUESTIONNAIRES,
  ROOT,
  STUDIES,
  STUDY,
  STUDY_TUD,
  SURVEY,
  TUD,
};
