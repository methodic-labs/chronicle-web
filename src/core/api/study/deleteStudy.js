// @flow

import { STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function createStudy(studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .delete(`/${studyId}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
