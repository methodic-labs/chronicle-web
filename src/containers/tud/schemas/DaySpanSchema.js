// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import {
  BED_TIME_BEFORE_ACTIVITY_DAY,
  DAY_END_TIME,
  DAY_START_TIME,
  TODAY,
  WAKE_UP_TIME_AFTER_ACTIVITY_DAY
} from '../../../common/constants';
import { DAY_SPAN_PAGE } from '../constants';
import TranslationKeys from '../constants/TranslationKeys';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (trans :TranslationFunction, activityDay :string) => {
  if (activityDay === TODAY) {
    return {
      type: 'object',
      title: '',
      properties: {
        [getPageSectionKey(DAY_SPAN_PAGE, 0)]: {
          type: 'object',
          title: '',
          properties: {
            [BED_TIME_BEFORE_ACTIVITY_DAY]: {
              default: '19:00',
              description: trans(TranslationKeys.DEFAULT_TIME),
              title: trans(TranslationKeys.BED_TIME_BEFORE_ACTIVITY_DAY),
              type: 'string',
            },
            [DAY_START_TIME]: {
              default: '07:00',
              description: trans(TranslationKeys.DEFAULT_TIME),
              title: trans(TranslationKeys.DAY_START_TIME, { context: activityDay }),
              type: 'string',
            },
            [DAY_END_TIME]: {
              default: '19:00',
              description: trans(TranslationKeys.DEFAULT_TIME),
              title: trans(TranslationKeys.DAY_END_TIME, { context: activityDay }),
              type: 'string',
            },
          },
          required: [BED_TIME_BEFORE_ACTIVITY_DAY, DAY_START_TIME, DAY_END_TIME],
        }
      }
    };
  }
  return {
    type: 'object',
    title: '',
    properties: {
      [getPageSectionKey(DAY_SPAN_PAGE, 0)]: {
        type: 'object',
        title: '',
        properties: {
          [DAY_START_TIME]: {
            type: 'string',
            title: trans(TranslationKeys.DAY_START_TIME, { context: activityDay }),
            description: trans(TranslationKeys.DEFAULT_TIME),
            default: '07:00'
          },
          [DAY_END_TIME]: {
            type: 'string',
            title: trans(TranslationKeys.DAY_END_TIME, { context: activityDay }),
            description: trans(TranslationKeys.DEFAULT_TIME),
            default: '19:00'
          },
          [WAKE_UP_TIME_AFTER_ACTIVITY_DAY]: {
            type: 'string',
            title: trans(TranslationKeys.WAKE_UP_TIME_AFTER_ACTIVITY_DAY),
            description: trans(TranslationKeys.DEFAULT_TIME),
            default: '07:00'
          }
        },
        required: [DAY_START_TIME, DAY_END_TIME, WAKE_UP_TIME_AFTER_ACTIVITY_DAY]
      }
    }
  };
};

const createUiSchema = (is12hourFormat :boolean) => ({
  [getPageSectionKey(DAY_SPAN_PAGE, 0)]: {
    classNames: 'column-span-12 grid-container',
    [DAY_START_TIME]: {
      classNames: 'column-span-12',
      'ui:widget': 'TimeWidget',
      'ui:placeholder': 'HH:MM AM',
      'ui:options': {
        ampm: is12hourFormat
      }
    },
    [DAY_END_TIME]: {
      classNames: 'column-span-12',
      'ui:widget': 'TimeWidget',
      'ui:placeholder': 'HH:MM PM',
      'ui:options': {
        ampm: is12hourFormat
      }
    },
    [BED_TIME_BEFORE_ACTIVITY_DAY]: {
      classNames: 'column-span-12',
      'ui:widget': 'TimeWidget',
      'ui:placeholder': 'HH:MM AM',
      'ui:options': {
        ampm: is12hourFormat
      }
    },
    [WAKE_UP_TIME_AFTER_ACTIVITY_DAY]: {
      classNames: 'column-span-12',
      'ui:widget': 'TimeWidget',
      'ui:placeholder': 'HH:MM AM',
      'ui:options': {
        ampm: is12hourFormat
      }
    }
  }
});

export {
  createSchema,
  createUiSchema
};
