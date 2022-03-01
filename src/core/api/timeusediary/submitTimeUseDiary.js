/*
 * @flow
 */

// $FlowIgnore
import { NIL as NIL_UUID } from 'uuid';

import { TIME_USE_DIARY_API } from '../../../common/constants';
import { getApiAxiosInstance } from '../axios';
import type { UUID } from '../../../common/types';

export default function submitTimeUseDiary(
  organizationId :UUID = NIL_UUID,
  studyId :UUID,
  participantId :string,
  data :Object
) :Promise<*> {
  return getApiAxiosInstance(TIME_USE_DIARY_API)
    .post(encodeURI(`/${organizationId}/${studyId}/${participantId}`), data)
    .then((axiosResponse) => axiosResponse.data)
    .catch((error :Error) => Promise.reject(error));
}
