import {
  SECONDARY_BOOK_TITLE,
  SECONDARY_BOOK_TYPE,
  SECONDARY_MEDIA_ACTIVITY,
  SECONDARY_MEDIA_AGE,
  SECONDARY_MEDIA_NAME,
} from '../../../common/constants';
import TranslationKeys from '../constants/TranslationKeys';
import getEnableChangesForOhioStateUniversity from '../utils/getEnableChangesForOhioStateUniversity';

const createSchema = (selectedActivity, translate, studySettings, activityDay) => {
  const primaryActivities = translate(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });
  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);
  switch (selectedActivity) {
    case primaryActivities.reading: {
      return {
        properties: {
          [SECONDARY_BOOK_TYPE]: {
            type: 'array',
            title: translate(TranslationKeys.BOOK_TYPE),
            description: translate(TranslationKeys.CHOOSE_APPLICABLE),
            items: {
              type: 'string',
              enum: translate(TranslationKeys.BOOK_TYPE_OPTIONS, { returnObjects: true })
            },
            uniqueItems: true,
            minItems: 1
          },
          [SECONDARY_BOOK_TITLE]: {
            type: 'string',
            title: translate(TranslationKeys.BOOK_TITLE)
          }
        },
        required: [SECONDARY_BOOK_TYPE]
      };
    }
    case primaryActivities.media_use:
      if (enableChangesForOSU) {
        return {
          properties: {
            [SECONDARY_MEDIA_ACTIVITY]: {
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
            [SECONDARY_MEDIA_NAME]: {
              title: translate(TranslationKeys.MEDIA_NAME, { returnObjects: true }),
              type: 'string',
            },
          },
          required: [SECONDARY_MEDIA_ACTIVITY],
        };
      }
      return {
        properties: {
          [SECONDARY_MEDIA_ACTIVITY]: {
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
          [SECONDARY_MEDIA_AGE]: {
            enum: translate(TranslationKeys.MEDIA_AGE_OPTIONS, { returnObjects: true }),
            title: translate(TranslationKeys.MEDIA_AGE),
            type: 'string',
          },
          [SECONDARY_MEDIA_NAME]: {
            title: translate(TranslationKeys.MEDIA_NAME, { returnObjects: true }),
            type: 'string',
          },
        },
        required: [SECONDARY_MEDIA_ACTIVITY, SECONDARY_MEDIA_AGE],
      };
    default: {
      return {
        properties: {},
        required: [],
      };
    }
  }
};

const createUiSchema = (translate) => ({
  [SECONDARY_MEDIA_ACTIVITY]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
    'ui:options': {
      withOther: true,
      otherText: translate(TranslationKeys.OTHER)
    }
  },
  [SECONDARY_BOOK_TYPE]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
    'ui:options': {
      withOther: true,
      otherText: translate(TranslationKeys.OTHER)
    }
  },
  [SECONDARY_BOOK_TITLE]: {
    classNames: 'column-span-12',
  },
  [SECONDARY_MEDIA_AGE]: {
    classNames: 'column-span-12',
    'ui:widget': 'radio'
  },
  [SECONDARY_MEDIA_NAME]: {
    classNames: 'column-span-12'
  }
});

export {
  createSchema,
  createUiSchema
};
