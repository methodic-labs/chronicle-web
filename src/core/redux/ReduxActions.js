/*
 * @flow
 */

const RESET_REQUEST_STATE :'RESET_REQUEST_STATE' = 'RESET_REQUEST_STATE';
type ResetRequestStateAction = {|
  actionType :string;
  type :typeof RESET_REQUEST_STATE;
|};

function resetRequestState(actionType :string) :ResetRequestStateAction {
  return {
    actionType,
    type: RESET_REQUEST_STATE,
  };
}

export {
  RESET_REQUEST_STATE,
  resetRequestState,
};

export type {
  ResetRequestStateAction,
};
