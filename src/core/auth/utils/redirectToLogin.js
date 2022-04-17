/*
 * @flow
 */

import qs from 'qs';

export default function redirectToLogin(location :Location) {

  const { href, origin } = location;
  const queryString = qs.stringify(
    { redirectUrl: href },
    { addQueryPrefix: true },
  );

  window.location.replace(`${origin}/login/${queryString}`);
}
