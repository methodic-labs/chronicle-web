/*
 * @flow
 */

import { DateTime } from 'luxon';

import formatDateTime from './formatDateTime';

export default function formatAsDate(value :string = '', fallback :string = '---') :string {

  return formatDateTime(value, DateTime.DATE_SHORT, fallback);
}
