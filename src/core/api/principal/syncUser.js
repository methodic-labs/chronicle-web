/*
 * @flow
 */

import { PRINCIPAL_API, SYNC } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function syncUser() :Promise<*> {

  return getApiAxiosInstance(PRINCIPAL_API)
    .get(`/${SYNC}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
