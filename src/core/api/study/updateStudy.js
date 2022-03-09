// @flow
import { RETRIEVE, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function updateStudy(study :Object, studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .patch(`/${studyId}?${RETRIEVE}=true`, study)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
