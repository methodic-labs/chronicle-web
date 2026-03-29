/*
 * @flow
 */

import isBoolean from 'lodash/isBoolean';
import isFinite from 'lodash/isFinite';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import { List, Map } from 'immutable';

import { isNonEmptyArray } from './LangUtils';

type ValidatorFn = (value :any) => boolean;

/*
 * https://github.com/mixer/uuid-validate
 * https://github.com/chriso/validator.js
 *
 * this regular expression comes from isUUID() from the validator.js library. isUUID() defaults to checking "all"
 * versions, but that means we lose validation against a specific version. for example, the regular expression returns
 * true for '00000000-0000-0000-0000-000000000000', but this UUID is technically not valid.
 */
const BASE_UUID_PATTERN :RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

function validateNonEmptyArray(value :any[], validatorFn :ValidatorFn) :boolean {

  if (!isNonEmptyArray(value)) {
    return false;
  }

  for (let index = 0; index < value.length; index += 1) {
    if (!validatorFn(value[index])) {
      return false;
    }
  }

  return true;
}

function isValidUUID(value :any) :boolean {

  return BASE_UUID_PATTERN.test(value);
}

function isValidUUIDArray(uuids :any[]) :boolean {

  return validateNonEmptyArray(uuids, (id :any) => isValidUUID(id));
}

function isValidDataPrimitive(value :any) :boolean {

  return isBoolean(value) || isFinite(value) || isString(value);
}

function isValidDataPrimitiveArray(values :any) :boolean {

  return validateNonEmptyArray(values, (value :any) => isValidDataPrimitive(value));
}

function isObjectOrMap(value :any) :boolean %checks {
  return isPlainObject(value) || Map.isMap(value);
}

function validateArrayOrListWith(values :any, predicate :Function) :boolean {
  if (Array.isArray(values) || List.isList(values)) {
    return values.every(predicate);
  }

  return false;
}

export {
  isObjectOrMap,
  isValidDataPrimitive,
  isValidDataPrimitiveArray,
  isValidUUID,
  isValidUUIDArray,
  validateArrayOrListWith,
  validateNonEmptyArray,
};
