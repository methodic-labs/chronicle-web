/*
 * @flow
 */

import { STUDY, TIME_USE_DIARY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getStudyTUDSubmissionsByDateRange(
  studyId :UUID,
  startDate :string,
  endDate :string,
) :Promise<*> {
  return getApiAxiosInstance(TIME_USE_DIARY_API)
    .get(`/${STUDY}/${studyId}?startDate=${startDate}&endDate=${endDate}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
