/*
 * @flow
 */

import { STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getStudy(studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${studyId}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
