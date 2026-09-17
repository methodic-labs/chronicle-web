/*
 * @flow
 */

import {
  EMAIL, PERMISSIONS, SEARCH, STUDY_API
} from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

/*
 * Prefix search over the user directory, restricted to study owners. Matching is on the start of the email address,
 * so "jane" finds "jane@example.com" but "example.com" does not.
 */
export default function searchStudyUsers(studyId :UUID, email :string) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${studyId}/${PERMISSIONS}/${SEARCH}`, { params: { [EMAIL]: email } })
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
