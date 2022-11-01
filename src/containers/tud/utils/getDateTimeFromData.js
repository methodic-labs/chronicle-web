import _get from 'lodash/get';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

const { getPageSectionKey } = DataProcessingUtils;

export default function getDateTimeFromData(page, key, data) {
  const psk = getPageSectionKey(page, 0);
  const result = _get(data, [psk, key]);
  return DateTime.fromISO(result);
}
