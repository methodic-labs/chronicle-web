/*
 * @flow
 */

import { STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function getAllStudies() :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get('/')
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
