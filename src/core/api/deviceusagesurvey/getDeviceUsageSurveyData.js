/*
 * @flow
 */

import { DateTime } from 'luxon';

import { PARTICIPANT, SURVEY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function getDeviceUsageSurveyData(
  studyId :UUID,
  participantId :string,
  dateFrom :DateTime,
  dateTo :DateTime,
) :Promise<any> {
  return getApiAxiosInstance(SURVEY_API)
    .get(encodeURI(`/${studyId}/${PARTICIPANT}/${participantId}/device-usage`), {
      params: {
        startDate: dateFrom.toISO(),
        endDate: dateTo.toISO(),
      }
    })
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
