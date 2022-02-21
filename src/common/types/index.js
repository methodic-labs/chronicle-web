/*
 * @flow
 */

export type UUID = string;

export type Auth0NonceState = {
  redirectUrl :string;
};

export type UserInfo = {
  email ?:string;
  familyName ?:string;
  givenName ?:string;
  id ?:string;
  name ?:string;
  picture ?:string;
  roles ?:string[];
};

export type AppUsageFreqType = {|
  DAILY :'DAILY';
  HOURLY :'HOURLY';
|};
