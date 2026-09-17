/*
 * @flow
 */

import { LoginTypes, StudyAccessLevels } from '../../../common/constants';
import type { LoginType, StudyAccessLevel } from '../../../common/types';

/*
 * The three levels of study access an owner can hand out, strongest first. These map onto the permission sets the
 * server assigns: owner gets every permission on the study acl key, manager gets {READ, WRITE}, viewer gets {READ}.
 */
export const ACCESS_LEVEL_OPTIONS :{|
  description :string;
  label :string;
  value :StudyAccessLevel;
|}[] = [
  {
    description: 'Full access, including granting and revoking access for others.',
    label: 'Owner',
    value: StudyAccessLevels.OWNER,
  },
  {
    description: 'Can manage the study and its participants, but not who has access to it.',
    label: 'Manager',
    value: StudyAccessLevels.MANAGER,
  },
  {
    description: 'Can view the study and its data, but cannot change anything.',
    label: 'Viewer',
    value: StudyAccessLevels.VIEWER,
  },
];

export const ACCESS_LEVEL_LABELS = {
  [StudyAccessLevels.MANAGER]: 'Manager',
  [StudyAccessLevels.OWNER]: 'Owner',
  [StudyAccessLevels.VIEWER]: 'Viewer',
};

/*
 * Which StudyPermissionsUpdate field grants each level. Revoking view access revokes every permission, so
 * revokeViewStudy is how the UI expresses both "take this person off the study" and, paired with a grant, "put them at
 * exactly this level instead" -- the server applies revocations before grants, so the two travel in one request.
 */
export function grantAccessUpdate(userId :string, level :StudyAccessLevel) :Object {
  switch (level) {
    case StudyAccessLevels.OWNER:
      return { grantOwnerStudy: [userId] };
    case StudyAccessLevels.MANAGER:
      return { grantManageStudy: [userId] };
    default:
      return { grantViewStudy: [userId] };
  }
}

export function setAccessLevelUpdate(userId :string, level :StudyAccessLevel) :Object {
  return {
    revokeViewStudy: [userId],
    ...grantAccessUpdate(userId, level),
  };
}

export function revokeAccessUpdate(userId :string) :Object {
  return { revokeViewStudy: [userId] };
}

export const LOGIN_TYPE_LABELS :{ [LoginType] :string } = {
  [LoginTypes.ENTERPRISE]: 'Enterprise SSO',
  [LoginTypes.OAUTH]: 'OAuth',
  [LoginTypes.PASSWORDLESS]: 'Passwordless',
  [LoginTypes.UNKNOWN]: 'Unknown login',
  [LoginTypes.USERNAME_PASSWORD]: 'Username & password',
};
