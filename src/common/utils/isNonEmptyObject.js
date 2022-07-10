/*
 * @flow
 */

import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';

export default function isNonEmptyObject(value :any) :boolean %checks {

  return isPlainObject(value) && !isEmpty(value);
}
