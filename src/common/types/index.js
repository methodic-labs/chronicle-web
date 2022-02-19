/*
 * @flow
 */

declare type Auth0NonceState = {
  redirectUrl :string;
};

declare type UserInfo = {
  email ?:string;
  familyName ?:string;
  givenName ?:string;
  id ?:string;
  name ?:string;
  picture ?:string;
  roles ?:string[];
};

type UUID = string;

export type {
  Auth0NonceState,
  UserInfo,
  UUID,
};
