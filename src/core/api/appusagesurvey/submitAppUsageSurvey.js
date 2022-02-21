/*
 * @flow
 */

import { PARTICIPANT, SURVEY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function submitAppUsageSurvey(studyId :UUID, participantId :string, data :Object) :Promise<*> {

  return getApiAxiosInstance(SURVEY_API)
    .post(encodeURI(`/${studyId}/${PARTICIPANT}/${participantId}/app-usage`), data)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
