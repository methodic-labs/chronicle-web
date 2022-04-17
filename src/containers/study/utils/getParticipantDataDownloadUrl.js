// @flow

import { DateTime } from 'luxon';

import getApiBaseUrl from '../../../core/api/axios/getApiBaseUrl';
import {
  CSRF_TOKEN,
  DATA,
  DATA_TYPE,
  END_DATE,
  FILE_NAME,
  PARTICIPANTS,
  PARTICIPANT_ID,
  ParticipantDataTypes,
  START_DATE,
  STUDY_API,
  TIME_USE_DIARY_API,
} from '../../../common/constants';
import { getCSRFToken } from '../../../core/auth/utils';
import type { ParticipantDataType, TimeUseDiaryDataType } from '../../../common/types';

export default function getParticipantDataDownloadUrl(
  studyId :UUID,
  participantId :string,
  startDate :?string,
  endDate :?string,
  dataType :ParticipantDataType,
  timeUseDiaryDataType :?TimeUseDiaryDataType,
  fileName :?string
) {

  const api = dataType === ParticipantDataTypes.TIME_USE_DIARY ? TIME_USE_DIARY_API : STUDY_API;

  const baseUrl = getApiBaseUrl(api);

  const result = new URL(`${baseUrl}/${studyId}/${PARTICIPANTS}/${DATA}/`);

  result.searchParams.set(PARTICIPANT_ID, participantId);
  result.searchParams.set(CSRF_TOKEN, getCSRFToken() || '');
  result.searchParams.set(DATA_TYPE, `${dataType}`);

  if (startDate) {
    result.searchParams.set(START_DATE, DateTime.fromISO(startDate).startOf('day').toISO());
  }
  if (endDate) {
    result.searchParams.set(END_DATE, DateTime.fromISO(endDate).endOf('day').toISO());
  }

  if (dataType === ParticipantDataTypes.TIME_USE_DIARY && timeUseDiaryDataType) {
    result.searchParams.set(DATA_TYPE, `${timeUseDiaryDataType}`);
  }

  if (fileName) {
    result.searchParams.set(FILE_NAME, fileName);
  }

  return result.href;
}
