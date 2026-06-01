// Regression test: i18next was normalizing language codes like "he-male" to
// "he-MALE" per BCP-47 (region/script subtag uppercasing). Our resource keys
// are lowercase, so the lookup missed and fell through to English. The shape
// test in translations.test.js validates JSON files but never exercises
// i18next's resolution, so this test fills the gap.

import i18next from 'i18next';

import Translations from './translations';

describe('i18n resource resolution', () => {

  const buildInstance = (lng) => {
    const resources = Object.fromEntries(
      Object.entries(Translations).map(([code, t]) => [code, { translation: t }])
    );
    const instance = i18next.createInstance();
    return instance.init({
      lng,
      resources,
      fallbackLng: 'en',
      lowerCaseLng: true,
    }).then(() => instance);
  };

  test('English keys resolve to English values', async () => {
    const i18n = await buildInstance('en');
    expect(i18n.t('today')).toBe(Translations.en.today);
    expect(i18n.t('choose_format')).toBe(Translations.en.choose_format);
  });

  test('he-male keys resolve to Hebrew values, not English fallback', async () => {
    const i18n = await buildInstance('he-male');
    expect(i18n.language).toBe('he-male');
    expect(i18n.t('today')).toBe(Translations['he-male'].today);
    expect(i18n.t('choose_format')).toBe(Translations['he-male'].choose_format);
  });

  test('he-female keys resolve to Hebrew female values', async () => {
    const i18n = await buildInstance('he-female');
    expect(i18n.language).toBe('he-female');
    expect(i18n.t('today')).toBe(Translations['he-female'].today);
    expect(i18n.t('choose_format')).toBe(Translations['he-female'].choose_format);
  });

  test('changeLanguage to he-male switches resolution to Hebrew', async () => {
    const i18n = await buildInstance('en');
    await i18n.changeLanguage('he-male');
    expect(i18n.t('today')).toBe(Translations['he-male'].today);
  });
});
