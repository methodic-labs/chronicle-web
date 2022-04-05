/*
 * @flow
 */

import { PARTICIPANTS, STATS, STUDY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function getParticipantStats(studyId :UUID) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .get(`/${studyId}/${PARTICIPANTS}/${STATS}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
