/*
 * @flow
 */

import { PERMISSIONS, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getStudyPermissions(studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${studyId}/${PERMISSIONS}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
