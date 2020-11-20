// @flow

import { DataProcessingUtils } from 'lattice-fabricate';
import { Info } from 'luxon';

import SCHEMA_FIELDS_TITLES from '../constants/SchemaFieldsTitles';
import { PAGE_NUMBERS } from '../constants/GeneralConstants';
import { NON_TYPICAL_DAY_REASONS, PROPERTY_CONSTS } from '../constants/SchemaConstants';

const { getPageSectionKey } = DataProcessingUtils;

const { PRE_SURVEY_PAGE } = PAGE_NUMBERS;

const {
  DAY_OF_WEEK,
  NON_TYPICAL_DAY_REASON,
  TYPICAL_DAY_FLAG
} = PROPERTY_CONSTS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(PRE_SURVEY_PAGE, 0)]: {
      type: 'object',
      title: '',
      properties: {
        [DAY_OF_WEEK]: {
          title: SCHEMA_FIELDS_TITLES[DAY_OF_WEEK],
          // $FlowFixMe
          enum: Info.weekdays(),
          type: 'string'
        },
        [TYPICAL_DAY_FLAG]: {
          title: SCHEMA_FIELDS_TITLES[TYPICAL_DAY_FLAG],
          type: 'string',
          enum: ['Yes', 'No'],
          enumNames: ['Yes, yesterday was typical.', 'No, yesterday was non-typical.']
        }
      },
      dependencies: {
        [TYPICAL_DAY_FLAG]: {
          oneOf: [
            {
              properties: {
                [TYPICAL_DAY_FLAG]: {
                  enum: ['Yes']
                }
              }
            },
            {
              properties: {
                [TYPICAL_DAY_FLAG]: {
                  enum: ['No']
                },
                [NON_TYPICAL_DAY_REASON]: {
                  title: SCHEMA_FIELDS_TITLES[NON_TYPICAL_DAY_REASON],
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: NON_TYPICAL_DAY_REASONS
                  },
                  description: 'Please choose all that apply.',
                  uniqueItems: true,
                  minItems: 1
                }
              },
              required: [NON_TYPICAL_DAY_REASON]
            }
          ]
        }
      },
      required: [DAY_OF_WEEK, TYPICAL_DAY_FLAG]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(PRE_SURVEY_PAGE, 0)]: {
    classNames: 'column-span-12 grid-container',
    [DAY_OF_WEEK]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
    },
    [TYPICAL_DAY_FLAG]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio'
    },
    [NON_TYPICAL_DAY_REASON]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes'
    }
  }
};

export {
  schema,
  uiSchema
};
