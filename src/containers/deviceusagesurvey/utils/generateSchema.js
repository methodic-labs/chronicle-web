/*
 * @flow
 */

import { Interval } from 'luxon';

import { PAGE_1_SECTION_1 } from '../../../common/constants';

export default function generateSchema(intervals :Interval[]) {

  const data = {};
  intervals.forEach((interval) => {
    data[`${interval.toString()}-title`] = {
      title: interval.toFormat('MMM d yyyy, h:mm a'),
      // default: 'ParagraphField default value is the description',
      type: 'string'
    };
    data[interval.toString()] = {
      description: 'Select all that apply',
      items: {
        enum: ['Parent alone', 'Child alone', 'Parent and child together', 'Other family member'],
        type: 'string',
      },
      // title: interval.toFormat('MMM d yyyy, h:mm a'),
      // title: '',
      title: ' ',
      type: 'array',
      uniqueItems: true,
    };
  });

  const dataSchema = {
    properties: {
      [PAGE_1_SECTION_1]: {
        properties: {
          ...data
        },
        title: '',
        type: 'object',
      },
    },
    title: '',
    type: 'object',
  };

  const ui = {};
  intervals.forEach((interval) => {
    ui[`${interval.toString()}-title`] = {
      classNames: 'column-span-12',
      'ui:field': 'ParagraphField',
    };
    ui[interval.toString()] = {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        noneText: "I don't know",
        row: true,
        withNone: true,
      },
    };
  });

  const uiSchema = {
    [PAGE_1_SECTION_1]: {
      classNames: 'column-span-12',
      ...ui
    }
  };

  return {
    dataSchema,
    uiSchema,
  };
}
