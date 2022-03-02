/*
 * @flow
 */

import {
  END_DATE,
  IDS,
  START_DATE,
  TIME_USE_DIARY_API,
} from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getTimeUseDiarySubmissionsByDateRange(
  studyId :UUID,
  startDate :string,
  endDate :string,
) :Promise<*> {
  return getApiAxiosInstance(TIME_USE_DIARY_API)
    .get(`/${studyId}/${IDS}?${START_DATE}=${startDate}&${END_DATE}=${endDate}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
