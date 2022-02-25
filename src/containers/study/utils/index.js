// @flow
import { NIL as NIL_UUID } from 'uuid';

const getBaseUrl = () => (
  window.location.href.split('#')[0]
);

// 2022-02-24: Default all orgIds to NIL if not provided

const getParticipantLoginLink = (orgId :UUID = NIL_UUID, studyId :UUID, participantId :string) => {
  const rootUrl = 'https://openlattice.com/chronicle/login';

  return `${rootUrl}?organizationId=${orgId}&studyId=${studyId}&participantId=${participantId}`;
};

const getTimeUseDiaryLink = (orgId :UUID = NIL_UUID, studyId :UUID, participantId :string) => (
  `${getBaseUrl()}#/time-use-diary`
  + `?organizationId=${orgId}`
  + `&studyId=${studyId}&participantId=${participantId}`
);

const getAppUsageLink = (orgId :UUID = NIL_UUID, studyId :UUID, participantId :string) => (
  `${getBaseUrl()}#/survey`
  + `?organizationId=${orgId}`
  + `&studyId=${studyId}&participantId=${participantId}`
);

export { default as createFormDataFromStudyEntity } from './createFormDataFromStudyEntity';
export { default as validateAddParticipantForm } from './validateAddParticipantForm';

export {
  getAppUsageLink,
  getParticipantLoginLink,
  getTimeUseDiaryLink
};
