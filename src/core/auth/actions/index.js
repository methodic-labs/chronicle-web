/*
 * @flow
 */

const AUTH_ATTEMPT :'AUTH_ATTEMPT' = 'AUTH_ATTEMPT';
const AUTH_SUCCESS :'AUTH_SUCCESS' = 'AUTH_SUCCESS';
const AUTH_FAILURE :'AUTH_FAILURE' = 'AUTH_FAILURE';
const AUTH_EXPIRED :'AUTH_EXPIRED' = 'AUTH_EXPIRED';
const LOGIN :'LOGIN' = 'LOGIN';
const LOGOUT :'LOGOUT' = 'LOGOUT';

const authAttempt = () => ({ type: AUTH_ATTEMPT });
const authExpired = () => ({ type: AUTH_EXPIRED });
const authFailure = (error :any) => ({ error, type: AUTH_FAILURE });
const authSuccess = (authToken :?string) => ({ authToken, type: AUTH_SUCCESS });
const login = () => ({ type: LOGIN });
const logout = () => ({ type: LOGOUT });

export {
  AUTH_ATTEMPT,
  AUTH_EXPIRED,
  AUTH_FAILURE,
  AUTH_SUCCESS,
  LOGIN,
  LOGOUT,
  authAttempt,
  authExpired,
  authFailure,
  authSuccess,
  login,
  logout,
};
