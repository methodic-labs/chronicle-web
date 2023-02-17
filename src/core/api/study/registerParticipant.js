/*
 * @flow
 */

import { PARTICIPANT, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function registerParticipant(studyId :UUID, participant :Object) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .post(`/${studyId}/${PARTICIPANT}`, participant)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
