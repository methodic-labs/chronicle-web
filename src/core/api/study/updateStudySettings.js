// @flow
import { SETTINGS, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function updateStudySettings(
  studyId :UUID,
  settingType :string,
  settings :Object,
) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .patch(`/${studyId}/${SETTINGS}/${settingType}`, settings)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
