/*
 * @flow
 */

import { DateTime } from 'luxon';

import { PARTICIPANT, SURVEY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function getAppUsageSurveyData(studyId :UUID, participantId :string, date :string) :Promise<*> {

  const startDate = DateTime.fromFormat(date, 'yyyy-MM-dd');
  if (!startDate.isValid) {
    return Promise.reject(Error(`invalid date - ${date}`));
  }

  return getApiAxiosInstance(SURVEY_API)
    .get(encodeURI(`/${studyId}/${PARTICIPANT}/${participantId}/app-usage`), {
      params: {
        startDate: startDate.toISO(),
        endDate: startDate.endOf('day').toISO(),
      }
    })
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
