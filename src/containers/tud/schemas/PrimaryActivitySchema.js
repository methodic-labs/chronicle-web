import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import {
  ACTIVITY_END_TIME,
  ACTIVITY_NAME,
  ACTIVITY_SELECT_PAGE,
  ACTIVITY_START_TIME,
} from '../../../common/constants';
import { DAY_SPAN_PAGE } from '../constants';
import TranslationKeys from '../constants/TranslationKeys';
import isFirstActivityPage from '../utils/isFirstActivityPage';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (
  pageNum,
  prevActivity,
  currentActivity,
  prevEndTime,
  is12hourFormat,
  activityDay,
  trans,
) => ({
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(pageNum, 0)]: {
      title: '',
      type: 'object',
      properties: {
        [ACTIVITY_SELECT_PAGE]: {
          default: true,
          type: 'boolean',
        },
        [ACTIVITY_NAME]: {
          type: 'string',
          title: (isFirstActivityPage(pageNum, activityDay)
            ? trans(TranslationKeys.PRIMARY_ACTIVITY, { time: prevEndTime.toLocaleString(DateTime.TIME_SIMPLE) })
            : trans(TranslationKeys.NEXT_ACTIVITY, {
              time: prevEndTime.toLocaleString(DateTime.TIME_SIMPLE),
              activity: prevActivity,
              interpolation: { escapeValue: false }
            })),
          enum: Object.values(trans(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true })),
          description: trans(TranslationKeys.SCROLL_ACTIVITIES)
        },
        [ACTIVITY_START_TIME]: {
          type: 'string',
          title: '',
          default: prevEndTime.toLocaleString(DateTime.TIME_24_SIMPLE)
        },
        [ACTIVITY_END_TIME]: {
          id: 'end_time',
          type: 'string',
          title: currentActivity
            ? trans(
              TranslationKeys.ACTIVITY_END_TIME, { activity: currentActivity, interpolation: { escapeValue: false } }
            )
            : trans(TranslationKeys.DEFAULT_END_TIME),
          description: trans(TranslationKeys.DEFAULT_TIME),
          default: prevEndTime.toLocaleString(DateTime.TIME_24_SIMPLE)
        },
      },
      required: [ACTIVITY_NAME, ACTIVITY_END_TIME]
    }
  },
});

const createUiSchema = (pageNum, is12hourFormat) => ({
  [getPageSectionKey(pageNum, 0)]: {
    classNames: 'column-span-12 grid-container',
    [ACTIVITY_SELECT_PAGE]: {
      classNames: 'hidden',
    },
    [ACTIVITY_NAME]: {
      classNames: (pageNum === DAY_SPAN_PAGE ? 'hidden' : 'column-span-12')
    },
    [ACTIVITY_START_TIME]: {
      classNames: (pageNum === DAY_SPAN_PAGE ? 'column-span-12' : 'hidden'),
      'ui:widget': 'TimeWidget',
      'ui:options': {
        ampm: is12hourFormat
      }
    },
    [ACTIVITY_END_TIME]: {
      classNames: 'column-span-12',
      'ui:widget': 'TimeWidget',
      'ui:options': {
        ampm: is12hourFormat
      }
    },
  },
});

export {
  createSchema,
  createUiSchema
};
