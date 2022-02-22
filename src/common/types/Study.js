/*
 * @flow
 */

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
