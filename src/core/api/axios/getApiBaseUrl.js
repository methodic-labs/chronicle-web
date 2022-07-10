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
  ORGANIZATION,
  ORGANIZATION_API,
  PRINCIPAL,
  PRINCIPAL_API,
  STUDY,
  STUDY_API,
  SURVEY,
  SURVEY_API,
  TIME_USE_DIARY_API,
  V3,
} from '../../../common/constants';
import { isNonEmptyString } from '../../../common/utils';
import { TIME_USE_DIARY } from '../../../utils/constants/UrlConstants';
import { getConfig } from '../../config/Configuration';

/* eslint-disable key-spacing */
const API_TO_PATH_MAP :Map<string, string> = OrderedMap({
  [AUTHORIZATIONS_API]: `${CHRONICLE}/${V3}/${AUTHORIZATIONS}`,
  [CANDIDATE_API]     : `${CHRONICLE}/${V3}/${CANDIDATE}`,
  [ORGANIZATION_API]  : `${CHRONICLE}/${V3}/${ORGANIZATION}`,
  [PRINCIPAL_API]     : `${DATASTORE}/${PRINCIPAL}`,
  [STUDY_API]         : `${CHRONICLE}/${V3}/${STUDY}`,
  [SURVEY_API]        : `${CHRONICLE}/${V3}/${SURVEY}`,
  [TIME_USE_DIARY_API]: `${CHRONICLE}/${V3}/${TIME_USE_DIARY}`
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
