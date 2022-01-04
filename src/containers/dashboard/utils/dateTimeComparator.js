// @flow
import { DateTime } from 'luxon';

function dateTimeComparator(a :string, b :string) {
  const dateTimeA = DateTime.fromISO(a);
  const dateTimeB = DateTime.fromISO(b);
  return dateTimeA.valueOf() - dateTimeB.valueOf();
}

export default dateTimeComparator;
