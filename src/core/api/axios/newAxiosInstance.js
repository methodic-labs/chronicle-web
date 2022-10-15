/*
 * @flow
 */

import axios from 'axios';
import isURL from 'validator/lib/isURL';
import type { Axios } from 'axios';

import { ERR_INVALID_URL } from '../../../common/constants';
import { isNonEmptyString } from '../../../common/utils';
import { getConfig } from '../../config/Configuration';

export default function newAxiosInstance(baseUrl :string) :Axios {

  if (!isURL(baseUrl, { require_tld: false })) {
    throw new Error(ERR_INVALID_URL);
  }

  const axiosConfigObj :Object = {
    baseURL: baseUrl,
    headers: {
      common: { 'Content-Type': 'application/json' },
      patch: { 'Content-Type': 'application/json' },
      post: { 'Content-Type': 'application/json' },
      put: { 'Content-Type': 'application/json' },
    },
  };

  const authToken :string = getConfig().get('authToken', '');
  if (isNonEmptyString(authToken)) {
    axiosConfigObj.headers.common.Authorization = `Bearer ${authToken}`;
  }

  return axios.create(axiosConfigObj);
}
