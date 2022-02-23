/*
 * @flow
 */

export type UUID = string;

export type AppUsageFreqType = {|
  DAILY :'DAILY';
  HOURLY :'HOURLY';
|};

export type Auth0NonceState = {
  redirectUrl :string;
};

export type AuthorizationObject = {|
  aclKey :UUID[];
  permissions :{
    OWNER ?:boolean;
    READ ?:boolean;
    WRITE ?:boolean;
  };
|};

export type PermissionTypesEnum = {|
  DISCOVER :'DISCOVER';
  INTEGRATE :'INTEGRATE';
  LINK :'LINK';
  MATERIALIZE :'MATERIALIZE';
  OWNER :'OWNER';
  READ :'READ';
  WRITE :'WRITE';
|};

export type PermissionType = $Values<PermissionTypesEnum>;

export type Study = {
  category :'Study';
  contact :string;
  createdAt :string;
  description :string;
  endedAt :string;
  group :string;
  id :UUID;
  lat :number;
  lon :number;
  notificationsEnabled :boolean;
  organizationIds :UUID[];
  settings :Object;
  startedAt :string;
  storage :string;
  title :string;
  updatedAt :string;
  version :string;
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

export type WorkerResponse =
  | {| data :any |}
  | {| error :Error |};
