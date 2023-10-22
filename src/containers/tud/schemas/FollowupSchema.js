import {
  PRIMARY_BOOK_TITLE,
  PRIMARY_BOOK_TYPE,
  PRIMARY_DEVICE_TYPE,
  PRIMARY_MEDIA_ACTIVITY,
  PRIMARY_MEDIA_AGE,
  PRIMARY_MEDIA_LANGUAGE,
  PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH,
  PRIMARY_MEDIA_NAME,
} from '../../../common/constants';
import TranslationKeys from '../constants/TranslationKeys';
import getEnableChangesForOhioStateUniversity from '../utils/getEnableChangesForOhioStateUniversity';

const createSchema = (selectedActivity, translate, studySettings, activityDay) => {

  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);

  const primaryActivities = translate(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });
  // translate to find which activity this is
  switch (selectedActivity) {
    case primaryActivities.reading: {
      return {
        properties: {
          [PRIMARY_BOOK_TYPE]: {
            description: translate(TranslationKeys.CHOOSE_APPLICABLE),
            items: {
              enum: translate(TranslationKeys.BOOK_TYPE_OPTIONS, { returnObjects: true }),
              type: 'string',
            },
            minItems: 1,
            title: translate(TranslationKeys.BOOK_TYPE),
            type: 'array',
            uniqueItems: true,
          },
          [PRIMARY_BOOK_TITLE]: {
            title: translate(TranslationKeys.BOOK_TITLE),
            type: 'string',
          },
        },
        required: [PRIMARY_BOOK_TYPE],
      };
    }
    case primaryActivities.media_use:
      if (enableChangesForOSU) {
        return {
          dependencies: {
            [PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH]: {
              oneOf: [
                {
                  properties: {
                    [PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH]: {
                      enum: [translate(TranslationKeys.NO)],
                    },
                  },
                },
                {
                  properties: {
                    [PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH]: {
                      enum: [translate(TranslationKeys.YES)],
                    },
                    [PRIMARY_MEDIA_LANGUAGE]: {
                      description: translate(TranslationKeys.CHOOSE_APPLICABLE, { returnObjects: true }),
                      items: {
                        enum: translate(TranslationKeys.LANGUAGE_OPTIONS, { returnObjects: true }),
                        type: 'string',
                      },
                      minItems: 1,
                      title: translate(TranslationKeys.LANGUAGE, { activityDay: translate(activityDay) }),
                      type: 'array',
                      uniqueItems: true,
                    },
                  },
                  required: [PRIMARY_MEDIA_LANGUAGE]
                },
              ],
            },
          },
          properties: {
            [PRIMARY_MEDIA_ACTIVITY]: {
              description: translate(TranslationKeys.CHOOSE_APPLICABLE),
              items: {
                enum: translate(TranslationKeys.MEDIA_ACTIVITY_OPTIONS, { returnObjects: true }),
                type: 'string',
              },
              minItems: 1,
              title: translate(TranslationKeys.MEDIA_ACTIVITY),
              type: 'array',
              uniqueItems: true,
            },
            [PRIMARY_MEDIA_NAME]: {
              title: translate(TranslationKeys.MEDIA_NAME),
              type: 'string',
            },
            [PRIMARY_DEVICE_TYPE]: {
              description: translate(TranslationKeys.CHOOSE_APPLICABLE),
              items: {
                enum: translate(TranslationKeys.DEVICE_TYPE_OPTIONS, { returnObjects: true }),
                type: 'string',
              },
              minItems: 1,
              title: translate(TranslationKeys.DEVICE_TYPE),
              type: 'array',
              uniqueItems: true,
            },
            [PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH]: {
              enum: [translate(TranslationKeys.YES), translate(TranslationKeys.NO)],
              title: translate(TranslationKeys.MEDIA_LANGUAGE_NON_ENGLISH),
              type: 'string',
            },
          },
          required: [PRIMARY_MEDIA_ACTIVITY, PRIMARY_DEVICE_TYPE],
        };
      }
      return {
        properties: {
          [PRIMARY_MEDIA_ACTIVITY]: {
            description: translate(TranslationKeys.CHOOSE_APPLICABLE),
            items: {
              enum: translate(TranslationKeys.MEDIA_ACTIVITY_OPTIONS, { returnObjects: true }),
              type: 'string',
            },
            minItems: 1,
            title: translate(TranslationKeys.MEDIA_ACTIVITY),
            type: 'array',
            uniqueItems: true,
          },
          [PRIMARY_MEDIA_AGE]: {
            enum: translate(TranslationKeys.MEDIA_AGE_OPTIONS, { returnObjects: true }),
            title: translate(TranslationKeys.MEDIA_AGE),
            type: 'string',
          },
          [PRIMARY_MEDIA_NAME]: {
            title: translate(TranslationKeys.MEDIA_NAME),
            type: 'string',
          },
        },
        required: [PRIMARY_MEDIA_ACTIVITY, PRIMARY_MEDIA_AGE],
      };
    default: {
      return {
        properties: {},
        required: []
      };
    }
  }
};

const createUiSchema = (translate) => ({
  [PRIMARY_MEDIA_ACTIVITY]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
    'ui:options': {
      otherText: translate(TranslationKeys.OTHER),
      withOther: true,
    },
  },
  [PRIMARY_BOOK_TYPE]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
    'ui:options': {
      otherText: translate(TranslationKeys.OTHER),
      withOther: true,
    },
  },
  [PRIMARY_BOOK_TITLE]: {
    classNames: 'column-span-12',
  },
  [PRIMARY_DEVICE_TYPE]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
  },
  [PRIMARY_MEDIA_AGE]: {
    classNames: 'column-span-12',
    'ui:widget': 'radio',
  },
  [PRIMARY_MEDIA_NAME]: {
    classNames: 'column-span-12',
  },
  [PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH]: {
    classNames: 'column-span-12',
    'ui:widget': 'radio',
  },
  [PRIMARY_MEDIA_LANGUAGE]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
    'ui:options': {
      otherText: translate(TranslationKeys.OTHER),
      withOther: true,
    },
  },
});

export {
  createSchema,
  createUiSchema
};
