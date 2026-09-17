/*
 * @flow
 */

import { PERMISSIONS, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

/*
 * "update" is a set of grants and revocations, keyed the way StudyPermissionsUpdate expects:
 * grant/revoke {View,Manage,Owner}Study, each holding a list of Auth0 user ids. Revocations are applied server side
 * before grants, so a single call can move someone from one access level to another.
 */
export default function updateStudyPermissions(studyId :UUID, update :Object) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .post(`/${studyId}/${PERMISSIONS}`, update)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
