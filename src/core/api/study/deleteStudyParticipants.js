/*
 * @flow
 */

import { PARTICIPANTS, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';

export default function deleteStudyParticipants(studyId :UUID, participantIds :string[]) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .delete(`/${studyId}/${PARTICIPANTS}`, { data: participantIds })
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
