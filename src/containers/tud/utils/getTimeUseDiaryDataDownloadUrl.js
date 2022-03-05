// @flow

import getApiBaseUrl from '../../../core/api/axios/getApiBaseUrl';
import {
  CSRF_TOKEN,
  DATA_TYPE,
  END_DATE,
  START_DATE,
  TIME_USE_DIARY_API
} from '../../../common/constants';
import { getCSRFToken } from '../../../core/auth/utils';
import type { UUID } from '../../../common/types';
import type { DataType } from '../constants/DataTypes';

export default function getTimeUseDiaryDataDownloadUrl(
  studyId :UUID,
  startDate :string,
  endDate :string,
  dataType :DataType
) :string {
  const configAuthToken :string = getCSRFToken() || '';
  const baseUrl = getApiBaseUrl(TIME_USE_DIARY_API);

  return `${baseUrl}/${studyId}`
  + `?${START_DATE}=${startDate}&${END_DATE}=${endDate}`
  + `&${DATA_TYPE}=${dataType}&${CSRF_TOKEN}=${configAuthToken}`;
}
