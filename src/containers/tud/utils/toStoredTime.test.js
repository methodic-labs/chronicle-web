import { DateTime } from 'luxon';

import toStoredTime from './toStoredTime';

describe('toStoredTime', () => {

  const time = DateTime.fromObject({ hour: 13, minute: 5 });

  test('produces a zero-padded HH:mm string', () => {
    expect(toStoredTime(time)).toBe('13:05');
    expect(toStoredTime(DateTime.fromObject({ hour: 0, minute: 0 }))).toBe('00:00');
    expect(toStoredTime(DateTime.fromObject({ hour: 9, minute: 30 }))).toBe('09:30');
  });

  test('returns undefined for invalid or missing input', () => {
    expect(toStoredTime(undefined)).toBeUndefined();
    expect(toStoredTime(null)).toBeUndefined();
    expect(toStoredTime(DateTime.fromISO('not-a-time'))).toBeUndefined();
  });

  // Regression: times are parsed back with DateTime.fromISO, so the stored value must be
  // locale-independent. toLocaleString(TIME_24_SIMPLE) yields "13.05" in locales such as fi/da,
  // which fromISO cannot parse -> "Invalid DateTime" and failed submission.
  describe('is locale-independent and round-trips through DateTime.fromISO', () => {
    ['en-US', 'de', 'he', 'fi', 'da', 'ar', 'es', 'sv'].forEach((locale) => {
      test(locale, () => {
        const stored = toStoredTime(time.setLocale(locale));
        expect(stored).toBe('13:05');
        expect(DateTime.fromISO(stored).isValid).toBe(true);
        const parsed = DateTime.fromISO(stored);
        expect(parsed.hour).toBe(13);
        expect(parsed.minute).toBe(5);
      });
    });
  });
});
