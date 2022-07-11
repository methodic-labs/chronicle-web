/*
 * @flow
 */

import { getIn } from 'immutable';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { REQUEST_STATE } from '../constants';

const useRequestState = (path :string[]) :?RequestState => {

  const requestState = useSelector((s) => getIn(s, [...path, REQUEST_STATE]));
  if (RequestStates[requestState]) {
    return requestState;
  }

  return undefined;
};

export default useRequestState;
