/*
 * @flow
 */
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import trim from 'lodash/trim';

export default function isNonEmptyString(value :any) :boolean %checks {

  return isString(value) && !isEmpty(trim(value));
}
