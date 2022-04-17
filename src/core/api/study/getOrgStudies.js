/*
 * @flow
 */

import { ORGANIZATION, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function getOrgStudies(organizationId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${ORGANIZATION}/${organizationId}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
