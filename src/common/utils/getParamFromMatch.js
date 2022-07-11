/*
 * @flow
 */

import _has from 'lodash/has';
import _isObject from 'lodash/isObject';
import _isString from 'lodash/isString';

type Match = {
  params :{ [key :string] :?string, ... };
};

export default function getParamFromMatch(match :Match, param :string) :?string {

  if (_isObject(match) && _isString(param)) {

    const { params = {} } = match;
    let targetParam = param;
    if (param.startsWith(':')) {
      targetParam = param.slice(1);
    }

    if (_has(params, targetParam)) {
      return params[targetParam];
    }
  }

  return null;
}
