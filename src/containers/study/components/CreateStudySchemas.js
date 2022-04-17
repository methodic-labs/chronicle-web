/*
 * @flow
 */

import {
  AppComponents,
  CONTACT,
  DESCRIPTION,
  FEATURES,
  GROUP,
  NOTIFICATIONS_ENABLED,
  STUDY_ID,
  TITLE,
  VERSION
} from '../../../common/constants';

const {
  CHRONICLE_DATA_COLLECTION,
  CHRONICLE_SURVEYS,
  IOS_SENSOR,
  TIME_USE_DIARY
} = AppComponents;

const createSchema = () => ({
  properties: {
    page1section1: {
      properties: {
        [TITLE]: {
          title: 'Study Name',
          type: 'string'
        },
        [DESCRIPTION]: {
          title: 'Description',
          type: 'string'
        },
        [GROUP]: {
          title: 'Study Group',
          type: 'string'
        },
        [VERSION]: {
          title: 'Study Version',
          type: 'string'
        },
        [CONTACT]: {
          title: 'Contact Email',
          type: 'string'
        },
        [STUDY_ID]: {
          title: '',
          type: 'string'
        },
        [FEATURES]: {
          title: 'Features',
          description: 'Select all that apply',
          type: 'array',
          items: {
            enum: [CHRONICLE_DATA_COLLECTION, CHRONICLE_SURVEYS, IOS_SENSOR, TIME_USE_DIARY],
            enumNames: ['Android Data Collection', 'Custom Surveys', 'iOS Sensor', 'Time Use Diary'],
            type: 'string'
          },
          minItems: 1,
          uniqueItems: true,
        },
        [NOTIFICATIONS_ENABLED]: {
          title: 'Enable daily notifications',
          type: 'boolean'
        },
      },
      required: [
        TITLE,
        FEATURES,
        CONTACT,
      ],
      type: 'object',
      title: ''
    },
  },
  type: 'object',
  title: ''
});

const createUiSchema = () => ({
  page1section1: {
    classNames: 'column-span-12 grid-container',
    [TITLE]: {
      classNames: 'column-span-12'
    },
    [DESCRIPTION]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
    [GROUP]: {
      classNames: 'column-span-6'
    },
    [VERSION]: {
      classNames: 'column-span-6'
    },
    [CONTACT]: {
      classNames: 'column-span-12'
    },
    [STUDY_ID]: {
      classNames: 'hidden'
    },
    [FEATURES]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [NOTIFICATIONS_ENABLED]: {
      classNames: 'column-span-12'
    }
  },
});

export { createSchema, createUiSchema };
