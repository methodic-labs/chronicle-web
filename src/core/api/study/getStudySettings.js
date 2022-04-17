/*
 * @flow
 */

import { SETTINGS, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getStudySettings(studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${studyId}/${SETTINGS}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
