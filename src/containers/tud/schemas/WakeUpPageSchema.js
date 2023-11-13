import { DataProcessingUtils } from 'lattice-fabricate';

import { WAKE_UP_TIME_AFTER_ACTIVITY_DAY } from '../../../common/constants';
import TranslationKeys from '../constants/TranslationKeys';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (page, translate) => ({
  properties: {
    [getPageSectionKey(page, 0)]: {
      properties: {
        [WAKE_UP_TIME_AFTER_ACTIVITY_DAY]: {
          default: '07:00',
          description: translate(TranslationKeys.DEFAULT_TIME),
          title: translate(TranslationKeys.WAKE_UP_TIME_AFTER_ACTIVITY_DAY),
          type: 'string',
        },
      },
      required: [WAKE_UP_TIME_AFTER_ACTIVITY_DAY],
      title: '',
      type: 'object',
    },
  },
  title: '',
  type: 'object',
});

const createUiSchema = (page, is12hourFormat) => ({
  [getPageSectionKey(page, 0)]: {
    classNames: 'column-span-12 grid-container',
    [WAKE_UP_TIME_AFTER_ACTIVITY_DAY]: {
      classNames: 'column-span-12',
      'ui:widget': 'TimeWidget',
      'ui:placeholder': 'HH:MM AM',
      'ui:options': {
        ampm: is12hourFormat,
      },
    },
  },
});

export {
  createSchema,
  createUiSchema,
};
