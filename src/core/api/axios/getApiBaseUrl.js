/*
 * @flow
 */

import { Map, OrderedMap } from 'immutable';
import { LangUtils } from 'lattice-utils';

import {
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
  SYNC,
  V3,
} from '../../../common/constants';
import { getConfig } from '../../config/Configuration';

const { isNonEmptyString } = LangUtils;

/* eslint-disable key-spacing */
const API_TO_PATH_MAP :Map<string, string> = OrderedMap({
  [CANDIDATE_API]   : `${CHRONICLE}/${V3}/${CANDIDATE}`,
  [ORGANIZATION_API]: `${CHRONICLE}/${V3}/${ORGANIZATION}`,
  [PRINCIPAL_API]   : `${DATASTORE}/${PRINCIPAL}`,
  [STUDY_API]       : `${CHRONICLE}/${V3}/${STUDY}`,
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
