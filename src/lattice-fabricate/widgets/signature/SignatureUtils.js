/*
 * @flow
 */

import { isNonEmptyString } from '../../utils/LangUtils';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
const DATA_URL_IMG_PNG_PREFIX :string = 'data:image/png;base64,';

// NOTE: this regex has only been tested for png, which has a different encoding format than jpeg and webp
const DATA_URL_PREFIX_REGEX :RegExp = /^data:image\/[a-z]+;base64,/;

const isBase64Simple = (value :any) => {

  try {
    // TODO: this is not a perfect validator
    return btoa(atob(value)) === value;
  }
  catch (err) {
    return false;
  }
};

// TODO: poorly named function
const tryConvertingToDataURL = (value :string) :string => {

  if (isNonEmptyString(value) && isBase64Simple(value)) {
    if (DATA_URL_PREFIX_REGEX.test(value)) {
      return value;
    }
    // TODO: determine mime type
    return `${DATA_URL_IMG_PNG_PREFIX}${value}`;
  }

  // TODO: guarantee that the return type is a string
  // TODO: handle URLs
  return value;
};

export {
  DATA_URL_IMG_PNG_PREFIX,
  DATA_URL_PREFIX_REGEX,
  isBase64Simple,
  tryConvertingToDataURL,
};
