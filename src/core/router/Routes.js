/*
 * @flow
 */
const ID_PARAM :':id' = ':id';
const ROOT :string = '/';
const LOGIN :string = '/login';
const STUDIES :string = '/studies';
const STUDY :string = `${STUDIES}/${ID_PARAM}`;
const PARTICIPANTS :string = `${STUDIES}/${ID_PARAM}/participants`;
const QUESTIONNAIRES :string = `${STUDIES}/${ID_PARAM}/questionnaires`;
const SURVEY :string = '/survey';
const QUESTIONNAIRE :string = '/questionnaire';
const TUD :string = '/time-use-diary';
const TUD_DASHBOARD :string = `${STUDIES}/${ID_PARAM}${TUD}`;

export {
  ID_PARAM,
  LOGIN,
  PARTICIPANTS,
  QUESTIONNAIRE,
  QUESTIONNAIRES,
  ROOT,
  STUDIES,
  STUDY,
  SURVEY,
  TUD,
  TUD_DASHBOARD
};
