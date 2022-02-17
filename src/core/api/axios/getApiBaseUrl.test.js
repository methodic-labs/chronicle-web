import { OrderedMap, fromJS } from 'immutable';

import getApiBaseUrl from './getApiBaseUrl';

import * as Config from '../../config/Configuration';
import {
  CANDIDATE,
  CANDIDATE_API,
  CHRONICLE,
  STUDY,
  STUDY_API,
  V3,
} from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';

/* eslint-disable key-spacing */
const API_TO_PATH_MAP = OrderedMap({
  [CANDIDATE_API]: `${CHRONICLE}/${V3}/${CANDIDATE}`,
  [STUDY_API]    : `${CHRONICLE}/${V3}/${STUDY}`,
});
/* eslint-enable */

const MOCK_BASE_URL = 'https://test.getmethodic.com';
const API_NAMES = [
  CANDIDATE_API,
  STUDY_API,
];

jest.mock('../../config/Configuration');
Config.getConfig.mockImplementation(() => fromJS({
  baseUrl: MOCK_BASE_URL
}));

describe('AxiosUtils : getApiBaseUrl()', () => {

  test('should throw if the given API is invalid', () => {
    INVALID_PARAMS.forEach((invalid) => {
      expect(() => {
        getApiBaseUrl(invalid);
      }).toThrow();
    });
  });

  test('should not throw if the given API is valid', () => {
    API_NAMES.forEach((apiName) => {
      expect(() => {
        getApiBaseUrl(apiName);
      }).not.toThrow();
    });
  });

  API_NAMES.forEach((apiName) => {
    test(`should return the correct base URL for ${apiName}`, () => {
      expect(getApiBaseUrl(apiName)).toEqual(
        `${MOCK_BASE_URL}/${API_TO_PATH_MAP.get(apiName)}`
      );
    });
  });

});
