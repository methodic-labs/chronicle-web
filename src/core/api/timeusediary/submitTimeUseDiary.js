/*
 * @flow
 */

// $FlowIgnore

import { PARTICIPANT, TIME_USE_DIARY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function submitTimeUseDiary(
  studyId :UUID,
  participantId :string,
  data :Object
) :Promise<*> {
  return getApiAxiosInstance(TIME_USE_DIARY_API)
    .post(encodeURI(`/${studyId}/${PARTICIPANT}/${participantId}`), data)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
