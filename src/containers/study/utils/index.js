// @flow
import { Map } from 'immutable';

import { StudySettingTypes } from '../../../common/constants';

const getBaseUrl = () => {
  const url = window.location.href.split('#')[0];
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// 2022-02-24: Default all orgIds to NIL if not provided
// TODO: Don't hard code link
const getParticipantLoginLink = (studyId :UUID, participantId :string) => (
  'https://app.getmethodic.com/enroll'
  + `?studyId=${studyId}`
  + `&participantId=${participantId}`
);

const getTimeUseDiaryLink = (
  studyId :UUID,
  participantId :string,
  activityDay :string,
  studySettings :Map = Map(),
  gender :?string = undefined,
) => {
  const tud = studySettings.get(StudySettingTypes.TIME_USE_DIARY) || Map();
  const language = tud.get('language');
  const clockFormat = tud.get('clockFormat');
  const clockFormatLocked = tud.get('clockFormatLocked');

  let url = `${getBaseUrl()}/#/time-use-diary`
    + `?studyId=${studyId}`
    + `&participantId=${participantId}`
    + `&day=${activityDay}`;

  if (language && language !== 'en') url += `&lang=${language}`;
  if (gender) url += `&gender=${gender}`;
  if (clockFormat && clockFormat !== 12) url += `&clockFormat=${clockFormat}`;
  if (clockFormatLocked) url += '&lockClockFormat=true';

  return url;
};

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
