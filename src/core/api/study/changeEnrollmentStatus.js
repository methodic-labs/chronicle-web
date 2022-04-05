// @flow

import {
  PARTICIPANT,
  PARTICIPATION_STATUS,
  STATUS,
  STUDY_API
} from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { ParticipationStatus } from '../../../common/types';

export default function changeEnrollmentStatus(
  studyId :UUID,
  participantId :string,
  participationStatus :ParticipationStatus
) :Promise<*> {

  return getApiAxiosInstance(STUDY_API)
    .patch(`/${studyId}/${PARTICIPANT}/${participantId}/${STATUS}?${PARTICIPATION_STATUS}=${participationStatus}`)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
