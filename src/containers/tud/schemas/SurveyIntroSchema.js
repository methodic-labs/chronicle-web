// @flow

import { ACTIVITY_DATE, ACTIVITY_DAY, CLOCK_FORMAT } from '../../../common/constants';
import { DataProcessingUtils } from '../../../lattice-fabricate';
import TranslationKeys from '../constants/TranslationKeys';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (trans :TranslationFunction, defaultClockFormat :number = 12) => ({
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(0, 0)]: {
      type: 'object',
      title: '',
      properties: {
        [ACTIVITY_DATE]: {
          type: 'string',
        },
        [ACTIVITY_DAY]: {
          type: 'string',
        },
        [CLOCK_FORMAT]: {
          title: trans(TranslationKeys.CHOOSE_FORMAT),
          type: 'number',
          enum: [12, 24],
          enumNames: trans(TranslationKeys.CLOCK_FORMATS, { returnObjects: true }),
          default: defaultClockFormat
        },
      },
      required: [CLOCK_FORMAT]
    }
  }
});

const uiSchema = {
  [getPageSectionKey(0, 0)]: {
    classNames: 'column-span-12 grid-container',
    [ACTIVITY_DATE]: {
      classNames: 'hidden',
    },
    [ACTIVITY_DAY]: {
      classNames: 'hidden',
    },
    [CLOCK_FORMAT]: {
      classNames: 'column-span-12',
    },
  }
};

export {
  createSchema,
  uiSchema
};
