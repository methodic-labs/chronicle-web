import { isInternalOAuthAccount, seesInternalAccounts, withoutInternalAccounts } from './internalAccounts';

import { LoginTypes } from '../../../common/constants';

const user = (email, loginType) => ({
  connections: [],
  email,
  emailVerified: true,
  loginType,
  name: null,
  picture: null,
  principal: { id: `auth0|${email}`, type: 'USER' },
});

const CUSTOMER = user('jane@university.edu', LoginTypes.OAUTH);
const STAFF_METHODIC = user('matthew@getmethodic.com', LoginTypes.OAUTH);
const STAFF_OPENLATTICE = user('support@openlattice.com', LoginTypes.OAUTH);
const PASSWORD_ON_OUR_DOMAIN = user('研究@getmethodic.com', LoginTypes.USERNAME_PASSWORD);

describe('isInternalOAuthAccount', () => {

  test('flags OAuth accounts on our own domains', () => {
    expect(isInternalOAuthAccount(STAFF_METHODIC)).toBe(true);
    expect(isInternalOAuthAccount(STAFF_OPENLATTICE)).toBe(true);
  });

  test('leaves customer accounts alone', () => {
    expect(isInternalOAuthAccount(CUSTOMER)).toBe(false);
  });

  test('only OAuth counts -- a password account on our domain is a real account', () => {
    expect(isInternalOAuthAccount(PASSWORD_ON_OUR_DOMAIN)).toBe(false);
  });

  test('domain matching is case insensitive', () => {
    expect(isInternalOAuthAccount(user('Matthew@GetMethodic.COM', LoginTypes.OAUTH))).toBe(true);
  });

  test('a lookalike domain is not our domain', () => {
    expect(isInternalOAuthAccount(user('evil@notgetmethodic.com', LoginTypes.OAUTH))).toBe(false);
    expect(isInternalOAuthAccount(user('evil@getmethodic.com.attacker.io', LoginTypes.OAUTH))).toBe(false);
  });

  test('tolerates a missing or malformed email', () => {
    expect(isInternalOAuthAccount(user(null, LoginTypes.OAUTH))).toBe(false);
    expect(isInternalOAuthAccount(user('no-at-sign', LoginTypes.OAUTH))).toBe(false);
    expect(isInternalOAuthAccount(undefined)).toBe(false);
  });
});

describe('seesInternalAccounts', () => {

  test('only getmethodic.com gets the unfiltered view', () => {
    expect(seesInternalAccounts('matthew@getmethodic.com')).toBe(true);
    expect(seesInternalAccounts('MATTHEW@GETMETHODIC.COM')).toBe(true);
  });

  test('openlattice.com does not -- it is legacy and stays filtered', () => {
    expect(seesInternalAccounts('support@openlattice.com')).toBe(false);
  });

  test('customers and unknown viewers do not', () => {
    expect(seesInternalAccounts('jane@university.edu')).toBe(false);
    expect(seesInternalAccounts(null)).toBe(false);
    expect(seesInternalAccounts(undefined)).toBe(false);
  });
});

describe('withoutInternalAccounts', () => {

  const everyone = [CUSTOMER, STAFF_METHODIC, STAFF_OPENLATTICE, PASSWORD_ON_OUR_DOMAIN];

  test('hides our OAuth accounts from a customer admin', () => {
    expect(withoutInternalAccounts(everyone, 'jane@university.edu'))
      .toEqual([CUSTOMER, PASSWORD_ON_OUR_DOMAIN]);
  });

  test('shows everything to a getmethodic.com viewer', () => {
    expect(withoutInternalAccounts(everyone, 'matthew@getmethodic.com')).toEqual(everyone);
  });

  test('filters when the viewer email is unknown', () => {
    expect(withoutInternalAccounts(everyone, null)).toEqual([CUSTOMER, PASSWORD_ON_OUR_DOMAIN]);
  });

  test('an openlattice.com viewer is filtered too, including their own account', () => {
    // Deliberate: the exception is getmethodic.com only, so a legacy openlattice.com viewer does not see
    // themselves in the list.
    expect(withoutInternalAccounts(everyone, 'support@openlattice.com'))
      .toEqual([CUSTOMER, PASSWORD_ON_OUR_DOMAIN]);
  });
});
