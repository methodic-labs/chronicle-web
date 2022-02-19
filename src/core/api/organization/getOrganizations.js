/*
 * @flow
 */

import { ORGANIZATION_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function getOrganizations() :Promise<*> {

  return getApiAxiosInstance(ORGANIZATION_API)
    .get('/')
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
