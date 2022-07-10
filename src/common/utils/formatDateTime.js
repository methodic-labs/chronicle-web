/*
 * @flow
 */

import { DateTime } from 'luxon';

// import type { IntlDateTimeFormatOptions } from 'luxon';

export default function formatDateTime(
  value :string = '',
  format :Intl$DateTimeFormatOptions, // luxon doesn't export IntlDateTimeFormatOptions yet
  fallback :string = '---',
) :string {

  const datetime = DateTime.fromISO(value);
  if (datetime.isValid) {
    return datetime.toLocaleString((format :any));
  }

  return fallback;
}
