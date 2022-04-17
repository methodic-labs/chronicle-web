/*
 * @flow
 */

import { PARTICIPANT, STUDY_API, VERIFY } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function verifyParticipant(studyId :UUID, participantId :string) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${studyId}/${PARTICIPANT}/${participantId}/${VERIFY}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
