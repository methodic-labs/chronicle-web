// @flow

import { DataProcessingUtils } from 'lattice-fabricate';
import { DAY_OF_WEEK, NON_TYPICAL_DAY_REASON, TYPICAL_DAY_FLAG } from '../../../common/constants';

import { PRE_SURVEY_PAGE } from '../constants';
import TranslationKeys from '../constants/TranslationKeys';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (trans :TranslationFunction, activityDay :string) => ({
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(PRE_SURVEY_PAGE, 0)]: {
      type: 'object',
      title: '',
      properties: {
        [DAY_OF_WEEK]: {
          title: trans(TranslationKeys.DAY_OF_WEEK, { activityDay: trans(activityDay), context: activityDay }),
          // $FlowFixMe
          enum: trans(TranslationKeys.WEEKDAY_OPTIONS, { returnObjects: true }),
          type: 'string'
        },
        [TYPICAL_DAY_FLAG]: {
          title: trans(TranslationKeys.TYPICAL_DAY, {
            activityDay: trans(activityDay),
            day: trans(TranslationKeys.WEEKDAY),
          }),
          type: 'string',
          enum: [trans(TranslationKeys.YES), trans(TranslationKeys.NO)],
          enumNames: trans(TranslationKeys.TYPICAL_DAY_CHOICES, {
            activityDay: trans(activityDay),
            returnObjects: true,
          })
        }
      },
      dependencies: {
        [TYPICAL_DAY_FLAG]: {
          oneOf: [
            {
              properties: {
                [TYPICAL_DAY_FLAG]: {
                  enum: [trans(TranslationKeys.YES)]
                }
              }
            },
            {
              properties: {
                [TYPICAL_DAY_FLAG]: {
                  enum: [trans(TranslationKeys.NO)]
                },
                [NON_TYPICAL_DAY_REASON]: {
                  title: trans(TranslationKeys.NON_TYPICAL_DAY, { activityDay: trans(activityDay) }),
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: trans(TranslationKeys.NON_TYPICAL_DAY_REASONS, { returnObjects: true })
                  },
                  description: trans(TranslationKeys.CHOOSE_APPLICABLE, { returnObjects: true }),
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
});

const createUiSchema = (trans :TranslationFunction) => ({
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
      'ui:widget': 'checkboxes',
      'ui:options': {
        withOther: true,
        otherText: trans(TranslationKeys.OTHER)
      }
    }
  }
});

export {
  createSchema,
  createUiSchema,
};
