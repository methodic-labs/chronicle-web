/*
 * @flow
 */

import { LangUtils, Logger } from 'lattice-utils';

const { isNonEmptyString } = LangUtils;

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
