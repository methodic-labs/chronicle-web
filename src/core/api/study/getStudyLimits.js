/*
 * @flow
 */

import { STUDY, STUDY_LIMITS_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getStudyLimits(studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_LIMITS_API)
    .get(`/${STUDY}/${studyId}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
