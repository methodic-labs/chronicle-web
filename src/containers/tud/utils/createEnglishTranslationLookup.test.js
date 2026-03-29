import { DAY_OF_WEEK } from '../../../common/constants';
import ARRAY_ORDER_PERMUTATIONS from '../constants/ArrayOrderPermutations';
import Translations from '../../../core/i18n/translations';
import createEnglishTranslationLookup from './createEnglishTranslationLookup';

const ENGLISH_WEEKDAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const HEBREW_WEEKDAYS_SUNDAY_FIRST = [
  'יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'
];

describe('ArrayOrderPermutations', () => {
  test('permutations should have the same length as the source array', () => {
    Object.entries(ARRAY_ORDER_PERMUTATIONS).forEach(([language, keys]) => {
      Object.entries(keys).forEach(([key, permutation]) => {
        const sourceArray = Translations[language]?.[key];
        if (sourceArray) {
          expect(permutation).toHaveLength(sourceArray.length);
        }
      });
    });
  });

  test('permutations should be valid (each index appears exactly once)', () => {
    Object.values(ARRAY_ORDER_PERMUTATIONS).forEach((keys) => {
      Object.values(keys).forEach((permutation) => {
        const sorted = [...permutation].sort((a, b) => a - b);
        expect(sorted).toEqual(Array.from({ length: permutation.length }, (_, i) => i));
      });
    });
  });
});

describe('createEnglishTranslationLookup', () => {

  describe('languages without permutations should map weekdays by index', () => {
    const languagesWithoutPermutation = Object.keys(Translations)
      .filter((lang) => lang !== 'en' && !ARRAY_ORDER_PERMUTATIONS[lang]);

    languagesWithoutPermutation.forEach((language) => {
      test(language, () => {
        const lookup = createEnglishTranslationLookup(
          { en: { translation: Translations.en }, [language]: { translation: Translations[language] } },
          language
        );

        const srcWeekdays = Translations[language].weekday_options;
        srcWeekdays.forEach((day, index) => {
          expect(lookup[DAY_OF_WEEK][day]).toBe(ENGLISH_WEEKDAYS[index]);
        });
      });
    });
  });

  describe('languages with permutations should map weekdays correctly', () => {
    const languagesWithPermutation = Object.keys(Translations)
      .filter((lang) => ARRAY_ORDER_PERMUTATIONS[lang]?.weekday_options);

    languagesWithPermutation.forEach((language) => {
      test(`${language} weekday reverse lookup maps to correct English day`, () => {
        const lookup = createEnglishTranslationLookup(
          { en: { translation: Translations.en }, [language]: { translation: Translations[language] } },
          language
        );

        const srcWeekdays = Translations[language].weekday_options;
        const permutation = ARRAY_ORDER_PERMUTATIONS[language].weekday_options;

        srcWeekdays.forEach((day, index) => {
          const expectedEnglish = ENGLISH_WEEKDAYS[permutation[index]];
          expect(lookup[DAY_OF_WEEK][day]).toBe(expectedEnglish);
        });
      });
    });
  });

  test('Hebrew Sunday-first weekdays should not map Sunday to Monday', () => {
    // Simulate Hebrew with Sunday-first ordering
    const hebrewTranslation = {
      ...Translations.en,
      weekday_options: HEBREW_WEEKDAYS_SUNDAY_FIRST,
    };

    const translationData = {
      en: { translation: Translations.en },
      'he-female': { translation: hebrewTranslation },
    };

    const lookup = createEnglishTranslationLookup(translationData, 'he-female');

    // Hebrew index 0 is Sunday — it must map to English "Sunday", not "Monday"
    expect(lookup[DAY_OF_WEEK]['יום ראשון']).toBe('Sunday');
    expect(lookup[DAY_OF_WEEK]['יום שני']).toBe('Monday');
    expect(lookup[DAY_OF_WEEK]['יום שלישי']).toBe('Tuesday');
    expect(lookup[DAY_OF_WEEK]['יום רביעי']).toBe('Wednesday');
    expect(lookup[DAY_OF_WEEK]['יום חמישי']).toBe('Thursday');
    expect(lookup[DAY_OF_WEEK]['יום שישי']).toBe('Friday');
    expect(lookup[DAY_OF_WEEK]['שבת']).toBe('Saturday');
  });

  test('without permutation, Sunday-first ordering would incorrectly map Sunday to Monday', () => {
    // This test documents the bug that permutations fix:
    // without the permutation, index-based lookup maps Hebrew[0] -> English[0]
    // i.e., "יום ראשון" (Sunday) -> "Monday" — WRONG
    const hebrewTranslation = {
      ...Translations.en,
      weekday_options: HEBREW_WEEKDAYS_SUNDAY_FIRST,
    };

    const translationData = {
      en: { translation: Translations.en },
      broken: { translation: hebrewTranslation },
    };

    // "broken" has no permutation entry, so it falls back to index-based mapping
    const lookup = createEnglishTranslationLookup(translationData, 'broken');

    // This INCORRECTLY maps Sunday -> Monday (the bug we're preventing)
    expect(lookup[DAY_OF_WEEK]['יום ראשון']).toBe('Monday');
  });

  test('English lookup should be identity for all weekdays', () => {
    // English should be a pass-through regardless of permutation logic
    const lookup = createEnglishTranslationLookup(
      { en: { translation: Translations.en } },
      'en'
    );

    ENGLISH_WEEKDAYS.forEach((day) => {
      expect(lookup[DAY_OF_WEEK][day]).toBe(day);
    });
  });
});
