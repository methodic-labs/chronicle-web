/*
 * @flow
 */

import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import type { DurationUnit } from 'luxon';

import hasAuthTokenExpired from './hasAuthTokenExpired';

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

describe('hasAuthTokenExpired()', () => {

  test('should return true when given an invalid parameter', () => {
    INVALID_PARAMS.forEach((invalid :any) => {
      expect(hasAuthTokenExpired(invalid)).toEqual(true);
    });
  });

  test('should return true when given an expired expiration', () => {
    LUXON_UNITS.forEach((unit :string) => {
      expect(hasAuthTokenExpired(DateTime.local().minus({ [unit]: 1 }).toMillis())).toEqual(true);
    });
  });

  test('should return false when given an expiration in the future', () => {
    LUXON_UNITS.forEach((unit :string) => {
      expect(hasAuthTokenExpired(DateTime.local().plus({ [unit]: 1 }).toMillis())).toEqual(false);
    });
  });

  test('should return true when given an expired auth token', () => {
    LUXON_UNITS.forEach((unit :string) => {
      // $FlowIgnore
      const expInSecondsSinceEpoch :number = DateTime.local().minus({ [unit]: 1 }).toSeconds();
      const mockAuthToken :string = jwt.sign({ data: genRandomString(), exp: expInSecondsSinceEpoch }, 'secret');
      expect(hasAuthTokenExpired(mockAuthToken)).toEqual(true);
    });
  });

  test('should return false when given an auth token with an expiration in the future', () => {
    LUXON_UNITS.forEach((unit :string) => {
      // $FlowIgnore
      const expInSecondsSinceEpoch :number = DateTime.local().plus({ [unit]: 1 }).toSeconds();
      const mockAuthToken :string = jwt.sign({ data: genRandomString(), exp: expInSecondsSinceEpoch }, 'secret');
      expect(hasAuthTokenExpired(mockAuthToken)).toEqual(false);
    });
  });

});
