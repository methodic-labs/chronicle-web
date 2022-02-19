/*
 * @flow
 */

import cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import type { DurationUnit } from 'luxon';

import isAuthenticated from './isAuthenticated';

import { AUTH0_ID_TOKEN } from '../../../common/constants';
import { INVALID_PARAMS } from '../../../common/constants/testing';
import { genRandomString } from '../../../common/utils/testing';

const LUXON_UNITS :DurationUnit[] = [
  'year',
  'years',
  'month',
  'months',
  'week',
  'weeks',
  'day',
  'days',
  'hour',
  'hours',
  'minute',
  'minutes',
  'second',
  'seconds',
  // I think these might cause intermittent / non-deterministic failures
  // 'millisecond',
  // 'milliseconds',
];

jest.mock('js-cookie');

describe('isAuthenticated()', () => {

  beforeEach(() => {
    localStorage.clear();
    cookies.get.mockClear();
    cookies.remove.mockClear();
    cookies.set.mockClear();
  });

  test('should return false if localStorage does not hold an auth token', () => {
    expect(isAuthenticated()).toEqual(false);
  });

  test('should return false if the stored auth token is invalid', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      localStorage.setItem(AUTH0_ID_TOKEN, invalid);
      expect(isAuthenticated()).toEqual(false);
      expect(cookies.get).not.toHaveBeenCalled();
    });
  });

  test('should return false if the stored auth token is expired', () => {
    LUXON_UNITS.forEach((unit :string) => {
      // $FlowIgnore
      const expInSecondsSinceEpoch :number = DateTime.local().minus({ [unit]: 1 }).toSeconds();
      const mockAuthToken :string = jwt.sign({ data: genRandomString(), exp: expInSecondsSinceEpoch }, 'secret');
      localStorage.setItem(AUTH0_ID_TOKEN, mockAuthToken);
      expect(isAuthenticated()).toEqual(false);
      expect(cookies.get).not.toHaveBeenCalled();
    });
  });

  test('should return false if the stored auth token expires in the future', () => {
    LUXON_UNITS.forEach((unit :string) => {
      // $FlowIgnore
      const expInSecondsSinceEpoch :number = DateTime.local().plus({ [unit]: 1 }).toSeconds();
      const mockAuthToken :string = jwt.sign({ data: genRandomString(), exp: expInSecondsSinceEpoch }, 'secret');
      localStorage.setItem(AUTH0_ID_TOKEN, mockAuthToken);
      expect(isAuthenticated()).toEqual(true);
      expect(cookies.get).not.toHaveBeenCalled();
    });
  });

});
