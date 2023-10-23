import { DataProcessingUtils } from 'lattice-fabricate';
import {
  BG_AUDIO_NIGHT,
  BG_TV_NIGHT,
  NON_TYPICAL_SLEEP_PATTERN,
  SLEEP_ARRANGEMENT,
  SLEEP_PATTERN,
  WAKE_UP_COUNT,
} from '../../../common/constants';

import TranslationKeys from '../constants/TranslationKeys';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (pageNum, translate, studySettings) => {

  let sleepingOptions = translate(TranslationKeys.SLEEP_ARRANGEMENT_OPTIONS, { returnObjects: true });

  const enableChangesForSherbrookeUniversity = studySettings
    .getIn(['TimeUseDiary', 'enableChangesForSherbrookeUniversity']) || false;
  if (enableChangesForSherbrookeUniversity) {
    sleepingOptions = sleepingOptions.map((o) => o.replace('Crib/cot/bed', 'Bed'));
  }

  return {
    properties: {
      [getPageSectionKey(pageNum, 0)]: {
        dependencies: {
          [SLEEP_PATTERN]: {
            oneOf: [
              {
                properties: {
                  [SLEEP_PATTERN]: {
                    enum: [translate(TranslationKeys.NO)],
                  },
                  [NON_TYPICAL_SLEEP_PATTERN]: {
                    items: {
                      enum: translate(TranslationKeys.NON_TYPICAL_SLEEP_OPTIONS, { returnObjects: true }),
                      type: 'string',
                    },
                    title: translate(TranslationKeys.NON_TYPICAL_SLEEP_PATTERN),
                    type: 'array',
                    uniqueItems: true,
                  },
                },
                required: [NON_TYPICAL_SLEEP_PATTERN],
              },
              {
                properties: {
                  [SLEEP_PATTERN]: {
                    enum: [translate(TranslationKeys.YES), translate(TranslationKeys.DONT_KNOW)],
                  },
                },
              },
            ],
          },
        },
        properties: {
          [SLEEP_PATTERN]: {
            enum: [translate(TranslationKeys.YES), translate(TranslationKeys.NO), translate(TranslationKeys.DONT_KNOW)],
            title: translate(TranslationKeys.SLEEP_PATTERN),
            type: 'string',
          },
          [SLEEP_ARRANGEMENT]: {
            items: {
              enum: sleepingOptions,
              type: 'string',
            },
            title: translate(TranslationKeys.SLEEP_ARRANGEMENT),
            type: 'array',
            uniqueItems: true,
          },
          [WAKE_UP_COUNT]: {
            enum: translate(TranslationKeys.WAKE_UP_COUNT_OPTIONS, { returnObjects: true }),
            title: translate(TranslationKeys.WAKE_UP_COUNT),
            type: 'string',
          },
          [BG_TV_NIGHT]: {
            enum: translate(TranslationKeys.BG_MEDIA_OPTIONS, { returnObjects: true }),
            title: translate(TranslationKeys.BG_TV_NIGHT),
            type: 'string',
          },
          [BG_AUDIO_NIGHT]: {
            enum: translate(TranslationKeys.BG_MEDIA_OPTIONS, { returnObjects: true }),
            title: translate(TranslationKeys.BG_AUDIO_NIGHT),
            type: 'string',
          }
        },
        required: [SLEEP_PATTERN, SLEEP_ARRANGEMENT, WAKE_UP_COUNT, BG_TV_NIGHT, BG_AUDIO_NIGHT],
        title: '',
        type: 'object',
      },
    },
    title: translate(TranslationKeys.NIGHTTIME_ACTIVITY_TITLE),
    type: 'object',
  };
};

const createUiSchema = (pageNum, translate) => ({
  [getPageSectionKey(pageNum, 0)]: {
    classNames: 'column-span-12 grid-container',
    'ui:order': [
      SLEEP_PATTERN,
      NON_TYPICAL_SLEEP_PATTERN,
      SLEEP_ARRANGEMENT,
      WAKE_UP_COUNT,
      BG_TV_NIGHT,
      BG_AUDIO_NIGHT,
    ],
    [SLEEP_PATTERN]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
    },
    [NON_TYPICAL_SLEEP_PATTERN]: {
      classNames: 'column-span-12',
      'ui:widget': 'OtherRadioWidget',
      'ui:options': {
        otherText: translate(TranslationKeys.OTHER),
      },
    },
    [SLEEP_ARRANGEMENT]: {
      classNames: 'column-span-12',
      'ui:widget': 'OtherRadioWidget',
      'ui:options': {
        otherText: translate(TranslationKeys.OTHER),
      },
    },
    [WAKE_UP_COUNT]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
    },
    [BG_TV_NIGHT]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
    },
    [BG_AUDIO_NIGHT]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
    },
  },
});

export {
  createSchema,
  createUiSchema,
};
