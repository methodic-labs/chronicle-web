/*
 * @flow
 */

import { Map } from 'immutable';
import type { Axios } from 'axios';

import getApiBaseUrl from './getApiBaseUrl';
import newAxiosInstance from './newAxiosInstance';

import { isNonEmptyString } from '../../../common/utils';
import { getConfig } from '../../config/Configuration';

let baseUrlToAxiosInstanceMap :Map<string, Axios> = Map();

export default function getApiAxiosInstance(api :string) :Axios {

  let axiosInstance :Axios;
  const baseUrl = getApiBaseUrl(api);
  if (!baseUrlToAxiosInstanceMap.has(baseUrl)) {
    axiosInstance = newAxiosInstance(baseUrl);
    baseUrlToAxiosInstanceMap = baseUrlToAxiosInstanceMap.set(baseUrl, axiosInstance);
  }

  axiosInstance = baseUrlToAxiosInstanceMap.get(baseUrl);
  const axiosInstanceAuthHeader :string = axiosInstance.defaults.headers.common.Authorization;
  const configAuthToken :string = getConfig().get('authToken', '');

  // the Axios instance Authorization header must equal "Bearer {auth_token}", where "auth_token" must equal the
  // configured auth token. if that's not the case, we need a new Axios instance because the configured auth token
  // has changed.
  if (
    axiosInstanceAuthHeader !== `Bearer ${configAuthToken}`
    && (isNonEmptyString(configAuthToken) || isNonEmptyString(axiosInstanceAuthHeader))
  ) {
    axiosInstance = newAxiosInstance(baseUrl);
    baseUrlToAxiosInstanceMap = baseUrlToAxiosInstanceMap.set(baseUrl, axiosInstance);
  }

  return baseUrlToAxiosInstanceMap.get(baseUrl);
}
