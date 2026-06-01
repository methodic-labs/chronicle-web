/*
 * Serializes a DateTime to the canonical "HH:mm" string used to persist times in the survey
 * form data.
 *
 * Form-data times are parsed back with DateTime.fromISO (see getDateTimeFromData and
 * createSubmitRequestBody), so the stored value MUST be a locale-independent ISO time string.
 * toLocaleString() is locale dependent — e.g. it yields "13.05" in fi/da or non-Latin digits in
 * some locales — and such values round-trip to an invalid DateTime ("Invalid DateTime"), which
 * also breaks time validation and makes submitted start/end datetimes NaN. toISOTime always
 * emits Latin digits and a colon separator regardless of the active locale.
 */
export default function toStoredTime(dateTime) {
  if (!dateTime || !dateTime.isValid) return undefined;
  return dateTime.toISOTime({ suppressSeconds: true, suppressMilliseconds: true, includeOffset: false });
}
