/*
 * @flow
 */

// import { USER_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function syncUser() :Promise<*> {

  return getApiAxiosInstance('UserApi')
    .get(`/sync`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
