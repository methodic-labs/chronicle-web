/*
 * @flow
 */

import { Map, OrderedMap } from 'immutable';

import {
  AUTHORIZATIONS,
  AUTHORIZATIONS_API,
  CANDIDATE,
  CANDIDATE_API,
  CHRONICLE,
  DATASTORE,
  ERR_INVALID_API,
  LIMITS,
  ORGANIZATION,
  ORGANIZATION_API,
  PRINCIPAL,
  PRINCIPAL_API,
  STUDY,
  STUDY_API,
  STUDY_LIMITS_API,
  SURVEY,
  SURVEY_API,
  TIME_USE_DIARY_API,
  TIME_USE_DIARY_PATH,
  V3,
} from '../../../common/constants';
import { isNonEmptyString } from '../../../common/utils';
import { getConfig } from '../../config/Configuration';

/* eslint-disable key-spacing */
const API_TO_PATH_MAP :Map<string, string> = OrderedMap({
  [AUTHORIZATIONS_API]: `${CHRONICLE}/${V3}/${AUTHORIZATIONS}`,
  [CANDIDATE_API]     : `${CHRONICLE}/${V3}/${CANDIDATE}`,
  [ORGANIZATION_API]  : `${CHRONICLE}/${V3}/${ORGANIZATION}`,
  [PRINCIPAL_API]     : `${DATASTORE}/${PRINCIPAL}`,
  [STUDY_API]         : `${CHRONICLE}/${V3}/${STUDY}`,
  [STUDY_LIMITS_API]  : `${CHRONICLE}/${LIMITS}`,
  [SURVEY_API]        : `${CHRONICLE}/${V3}/${SURVEY}`,
  [TIME_USE_DIARY_API]: `${CHRONICLE}/${V3}/${TIME_USE_DIARY_PATH}`
});
/* eslint-enable */

export default function getApiBaseUrl(api :string) :string {

  if (!isNonEmptyString(api)) {
    throw new Error(ERR_INVALID_API);
  }

  if (!API_TO_PATH_MAP.has(api)) {
    throw new Error(`${ERR_INVALID_API}: ${api}`);
  }

  return `${getConfig().get('baseUrl')}/${API_TO_PATH_MAP.get(api)}`;
}
