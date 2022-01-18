/*
 * @flow
 */

import type { Match } from 'react-router-dom';

const getIdFromMatch = (match :Match) :?string => {

  const {
    params: {
      id = null,
    } = {},
  } = match;

  return id;
};

/* eslint-disable import/prefer-default-export */
export {
  getIdFromMatch,
};
/* eslint-enable */
