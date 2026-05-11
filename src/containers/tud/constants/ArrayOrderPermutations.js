// @flow

import { LanguageCodes } from '../../../common/constants';

/*
 * Languages that order array-type translation values differently from English.
 *
 * Each entry maps a translation key to a permutation array where
 *   permutation[sourceIndex] = englishIndex
 *
 * Example: Hebrew weekday_options uses Sunday-first ordering [Sun, Mon, Tue, ...]
 * while English uses Monday-first [Mon, Tue, Wed, ...].
 * So Hebrew index 0 (Sunday) corresponds to English index 6 (Sunday):
 *   [6, 0, 1, 2, 3, 4, 5]
 */

const ARRAY_ORDER_PERMUTATIONS :{[string] :{[string] :number[]}} = {
  [LanguageCodes.HEBREW_FEMALE]: {
    weekday_options: [6, 0, 1, 2, 3, 4, 5],
  },
  [LanguageCodes.HEBREW_MALE]: {
    weekday_options: [6, 0, 1, 2, 3, 4, 5],
  },
};

export default ARRAY_ORDER_PERMUTATIONS;
