/*
 * @flow
 */

import { STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function createStudy(study :Object) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .post('/', study)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
