// @flow

import { Map, fromJS } from 'immutable';

import EnvTypes from './EnvTypes';

const { LOCAL, PRODUCTION, STAGING } = EnvTypes;

const ENV_URLS :Map<string, string> = fromJS({
  [LOCAL]: 'http://localhost:8090',
  [PRODUCTION]: 'https://api.getmethodic.com',
  [STAGING]: 'https://api.staging.getmethodic.com'
});

export default ENV_URLS;
