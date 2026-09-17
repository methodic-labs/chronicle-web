import {
  grantAccessUpdate,
  revokeAccessUpdate,
  setAccessLevelUpdate,
} from './studyAccess';

import { StudyAccessLevels } from '../../../common/constants';

const USER_ID = 'auth0|1234';

describe('studyAccess update builders', () => {

  test('grantAccessUpdate only grants, so an existing grant is left alone', () => {
    expect(grantAccessUpdate(USER_ID, StudyAccessLevels.OWNER)).toEqual({ grantOwnerStudy: [USER_ID] });
    expect(grantAccessUpdate(USER_ID, StudyAccessLevels.MANAGER)).toEqual({ grantManageStudy: [USER_ID] });
    expect(grantAccessUpdate(USER_ID, StudyAccessLevels.VIEWER)).toEqual({ grantViewStudy: [USER_ID] });
  });

  test('setAccessLevelUpdate revokes everything first, so the user ends up at exactly the chosen level', () => {
    expect(setAccessLevelUpdate(USER_ID, StudyAccessLevels.MANAGER)).toEqual({
      grantManageStudy: [USER_ID],
      revokeViewStudy: [USER_ID],
    });
  });

  test('setAccessLevelUpdate to owner keeps the user an owner, so the last-owner guard is satisfied', () => {
    expect(setAccessLevelUpdate(USER_ID, StudyAccessLevels.OWNER)).toEqual({
      grantOwnerStudy: [USER_ID],
      revokeViewStudy: [USER_ID],
    });
  });

  test('revokeAccessUpdate revokes view, which strips every permission', () => {
    expect(revokeAccessUpdate(USER_ID)).toEqual({ revokeViewStudy: [USER_ID] });
  });
});
