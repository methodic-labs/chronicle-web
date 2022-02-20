/*
 * @flow
 */

export default function getDomainForCookie() :string {

  const { hostname } = window.location;
  const domain :string = hostname.split('.').splice(-2).join('.');
  const prefix :string = (hostname === 'localhost') ? '' : '.';
  return `${prefix}${domain}`;
}
