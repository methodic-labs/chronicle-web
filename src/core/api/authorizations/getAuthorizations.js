/*
 * @flow
 */

import { AUTHORIZATIONS_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function getAuthorizations(checks :Object[]) :Promise<*> {

  return getApiAxiosInstance(AUTHORIZATIONS_API)
    .post('/', checks)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
