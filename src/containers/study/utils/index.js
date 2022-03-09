// @flow

const getBaseUrl = () => {
  const url = window.location.href.split('#')[0];
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// 2022-02-24: Default all orgIds to NIL if not provided
// TODO: Don't hard code link
const getParticipantLoginLink = (studyId :UUID, participantId :string) => (
  'https://openlattice.com/chronicle/login'
  + `?studyId=${studyId}`
  + `&participantId=${participantId}`
);

const getTimeUseDiaryLink = (studyId :UUID, participantId :string) => (
  `${getBaseUrl()}/#/time-use-diary`
  + `?studyId=${studyId}`
  + `&participantId=${participantId}`
);

const getAppUsageLink = (studyId :UUID, participantId :string) => (
  `${getBaseUrl()}/#/survey`
  + `?studyId=${studyId}`
  + `&participantId=${participantId}`
);

export { default as createFormDataFromStudyEntity } from './createFormDataFromStudyEntity';
export { default as validateAddParticipantForm } from './validateAddParticipantForm';

export {
  getAppUsageLink,
  getParticipantLoginLink,
  getTimeUseDiaryLink
};
