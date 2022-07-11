/*
 * @flow
 */

import Logger from './Logger';
import isNonEmptyString from './isNonEmptyString';

const LOG = new Logger('getLocalStorage');

export default function getLocalStorage(key :string) :mixed {

  const stored = localStorage.getItem(key) || '';
  if (isNonEmptyString(stored)) {
    try {
      return JSON.parse(stored);
    }
    catch (e) {
      LOG.warn('failed to parse value from localStorage', stored);
    }
  }
  return stored;
}
