/*
 * @flow
 */

import { LoginTypes } from '../../../common/constants';
import { isNonEmptyString } from '../../../common/utils';

/*
 * Our own staff sign in to customer studies with OAuth accounts on these domains. They are real accounts holding real
 * access, but a customer admin managing their study has no use for them in a search result or an access list, so they
 * are hidden -- unless the person looking is themselves on getmethodic.com.
 *
 * Only OAuth accounts are hidden. A username & password account on one of these domains is a real customer-facing
 * account that happens to share the domain, so it stays visible.
 */
const INTERNAL_EMAIL_DOMAINS = ['getmethodic.com', 'openlattice.com'];

/*
 * The one domain whose signed in users see everything. openlattice.com is legacy and does not get the unfiltered
 * view -- an openlattice.com viewer is filtered like any customer, including their own account.
 */
const UNFILTERED_EMAIL_DOMAIN = 'getmethodic.com';

function emailDomain(email :?string) :string {
  if (!isNonEmptyString(email)) {
    return '';
  }
  // lastIndexOf, not split: the local part of an address may itself contain an "@" when quoted.
  const separatorIndex = email.lastIndexOf('@');
  return separatorIndex === -1 ? '' : email.slice(separatorIndex + 1).toLowerCase().trim();
}

export function isInternalOAuthAccount(user :?Object) :boolean {
  if (!user || user.loginType !== LoginTypes.OAUTH) {
    return false;
  }
  return INTERNAL_EMAIL_DOMAINS.includes(emailDomain(user.email));
}

export function seesInternalAccounts(viewerEmail :?string) :boolean {
  return emailDomain(viewerEmail) === UNFILTERED_EMAIL_DOMAIN;
}

/*
 * Hides internal OAuth accounts from a list of directory entries, unless the viewer is on getmethodic.com.
 *
 * This is presentation only. The accounts still hold whatever access they hold, and the server still reports them --
 * hiding a row does not revoke anything.
 */
export function withoutInternalAccounts<T :Object>(users :T[], viewerEmail :?string) :T[] {
  if (seesInternalAccounts(viewerEmail)) {
    return users;
  }
  return users.filter((user) => !isInternalOAuthAccount(user));
}
