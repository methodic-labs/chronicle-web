import axios from 'axios';
import { Map, fromJS } from 'immutable';

import newAxiosInstance from './newAxiosInstance';

import * as Config from '../../config/Configuration';
import { INVALID_PARAMS } from '../../../common/constants/testing';

const axiosCreateSpy = jest.spyOn(axios, 'create');

const MOCK_AUTH_TOKEN = 'mock.auth.token';
const MOCK_BASE_URL = 'https://test.getmethodic.com';

jest.mock('../../config/Configuration');
Config.getConfig.mockImplementation(() => Map());

describe('AxiosUtils : newAxiosInstance()', () => {

  beforeEach(() => {
    jest.resetModules();
    Config.getConfig.mockClear();
    axiosCreateSpy.mockClear();
  });

  test('should throw if the given URL is invalid', () => {
    INVALID_PARAMS.forEach((invalid) => {
      expect(() => {
        newAxiosInstance(invalid);
      }).toThrow();
    });
  });

  test('should not throw if the given URL is valid', () => {
    expect(() => {
      newAxiosInstance(MOCK_BASE_URL);
    }).not.toThrow();
  });

  test('should not throw if the given URL is localhost', () => {
    expect(() => {
      newAxiosInstance('http://localhost:8080');
    }).not.toThrow();
  });

  test('should create a new Axios instance with the correct Authorization header', () => {

    Config.getConfig.mockImplementationOnce(() => fromJS({
      authToken: MOCK_AUTH_TOKEN
    }));

    const axiosInstance = newAxiosInstance(MOCK_BASE_URL);

    expect(axiosCreateSpy).toHaveBeenCalledTimes(1);
    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: MOCK_BASE_URL,
      headers: {
        common: {
          Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        patch: {
          'Content-Type': 'application/json',
        },
        post: {
          'Content-Type': 'application/json',
        },
        put: {
          'Content-Type': 'application/json',
        },
      }
    });

    expect(axiosInstance.defaults.baseURL).toEqual(MOCK_BASE_URL);
    expect(axiosInstance.defaults.headers.common.Authorization).toEqual(`Bearer ${MOCK_AUTH_TOKEN}`);
  });

  test('should create a new Axios instance without an Authorization header when authToken is undefined', () => {

    const axiosInstance = newAxiosInstance(MOCK_BASE_URL);

    expect(axiosCreateSpy).toHaveBeenCalledTimes(1);
    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: MOCK_BASE_URL,
      headers: {
        common: {
          'Content-Type': 'application/json',
        },
        patch: {
          'Content-Type': 'application/json',
        },
        post: {
          'Content-Type': 'application/json',
        },
        put: {
          'Content-Type': 'application/json',
        },
      }
    });

    expect(axiosInstance.defaults.baseURL).toEqual(MOCK_BASE_URL);
    expect(axiosInstance.defaults.headers.common.Authorization).toBeUndefined();
  });

});
