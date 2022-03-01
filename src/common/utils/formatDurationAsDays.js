/*
 * @flow
 */

import { DateTime, Interval } from 'luxon';

export default function formatDurationAsDays(start :?string = '', end :?string = '', fallback :string = '---') {

  const startDateTime = DateTime.fromISO(start || '');
  const endDateTime = DateTime.fromISO(end || '');
  const duration = Interval.fromDateTimes(startDateTime, endDateTime).toDuration('days');

  if (duration.isValid) {
    const days = duration.toFormat('d');
    return `${days} ${(days === '1') ? 'day' : 'days'}`;
  }

  return fallback;
}
