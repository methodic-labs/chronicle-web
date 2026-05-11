/*
 * @flow
 */

import {
  AppComponents,
  CLOCK_FORMAT,
  CLOCK_FORMAT_LOCKED,
  CONTACT,
  DESCRIPTION,
  FEATURES,
  GROUP,
  LANGUAGE,
  NOTIFICATIONS_ENABLED,
  STUDY_ID,
  TITLE,
  VERSION
} from '../../../common/constants';
import SUPPORTED_LANGUAGES from '../../tud/constants/SupportedLanguages';

const INTERNATIONALIZATION = 'internationalization';

const {
  CHRONICLE_DATA_COLLECTION,
  CHRONICLE_SURVEYS,
  IOS_SENSOR,
  TIME_USE_DIARY
} = AppComponents;

const createSchema = (isEdit :boolean = false) => ({
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
        ...(isEdit && {
          [INTERNATIONALIZATION]: {
            title: 'Internationalization',
            type: 'object',
            properties: {
              [LANGUAGE]: {
                title: 'Language',
                type: 'string',
                enum: SUPPORTED_LANGUAGES.map((lng) => lng.code),
                enumNames: SUPPORTED_LANGUAGES.map((lng) => lng.language),
                default: 'en'
              },
              [CLOCK_FORMAT]: {
                title: 'Clock Format',
                type: 'number',
                enum: [12, 24],
                enumNames: ['12-hour', '24-hour'],
                default: 12
              },
              [CLOCK_FORMAT_LOCKED]: {
                title: 'Lock clock format (hide 12h/24h selector for participants)',
                type: 'boolean',
                default: false
              }
            }
          }
        }),
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

const createUiSchema = (isEdit :boolean = false) => ({
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
    ...(isEdit && {
      [INTERNATIONALIZATION]: {
        classNames: 'column-span-12 grid-container',
        [LANGUAGE]: {
          classNames: 'column-span-6'
        },
        [CLOCK_FORMAT]: {
          classNames: 'column-span-6'
        },
        [CLOCK_FORMAT_LOCKED]: {
          classNames: 'column-span-12'
        }
      }
    }),
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

export { INTERNATIONALIZATION, createSchema, createUiSchema };
