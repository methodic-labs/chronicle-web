import { DataProcessingUtils } from 'lattice-fabricate';
import merge from 'lodash/merge';
import { DateTime } from 'luxon';

import * as FollowupSchema from './FollowupSchema';
import * as SecondaryActivitySchema from './SecondaryActivitySchema';
import * as SecondaryFollowUpSchema from './SecondaryFollowUpSchema';

import {
  ACTIVITY_END_TIME,
  ACTIVITY_NAME,
  ACTIVITY_START_TIME,
  ADULT_MEDIA,
  BG_AUDIO_DAY,
  BG_TV_DAY,
  CAREGIVER,
  COLLABORATOR,
  HAS_FOLLOWUP_QUESTIONS,
  OTHER_ACTIVITY,
  PRIMARY_BOOK_LANGUAGE,
  PRIMARY_BOOK_LANGUAGE_NON_ENGLISH,
  PRIMARY_BOOK_TITLE,
  PRIMARY_BOOK_TYPE,
  PRIMARY_DEVICE_TYPE,
  PRIMARY_MEDIA_ACTIVITY,
  PRIMARY_MEDIA_AGE,
  PRIMARY_MEDIA_LANGUAGE,
  PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH,
  PRIMARY_MEDIA_NAME,
  SECONDARY_ACTIVITY,
  SECONDARY_BOOK_TITLE,
  SECONDARY_BOOK_TYPE,
  SECONDARY_MEDIA_ACTIVITY,
  SECONDARY_MEDIA_AGE,
  SECONDARY_MEDIA_NAME,
} from '../../../common/constants';
import TranslationKeys from '../constants/TranslationKeys';
import getEnableChangesForOhioStateUniversity from '../utils/getEnableChangesForOhioStateUniversity';

const { getPageSectionKey } = DataProcessingUtils;

const createSchema = (
  pageNum,
  selectedActivity,
  prevStartTime,
  prevEndTime,
  isSecondaryReadingSelected,
  isSecondaryMediaSelected,
  translate,
  studySettings,
  activityDay,
) => {

  const psk = getPageSectionKey(pageNum, 0);

  const followupSchema = FollowupSchema.createSchema(selectedActivity, translate, studySettings, activityDay);
  const secondaryActivitySchema = SecondaryActivitySchema.createSchema(selectedActivity, translate, studySettings);

  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);
  const primaryActivities = translate(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });

  let schema;
  if (enableChangesForOSU) {
    schema = {
      properties: {
        [psk]: {
          dependencies: {
            ...followupSchema.dependencies,
            ...secondaryActivitySchema.dependencies,
          },
          properties: {
            [HAS_FOLLOWUP_QUESTIONS]: {
              default: true,
              type: 'boolean',
            },
            [ACTIVITY_NAME]: {
              default: selectedActivity,
              type: 'string',
            },
            [ACTIVITY_START_TIME]: {
              default: prevStartTime.toLocaleString(DateTime.TIME_24_SIMPLE),
              type: 'string',
            },
            [ACTIVITY_END_TIME]: {
              default: prevEndTime.toLocaleString(DateTime.TIME_24_SIMPLE),
              type: 'string',
            },
            [COLLABORATOR]: {
              enum: translate(TranslationKeys.COLLABORATOR_OPTIONS, { returnObjects: true }),
              title: translate(TranslationKeys.COLLABORATOR),
              type: 'string',
            },
            ...followupSchema.properties,
            ...secondaryActivitySchema.properties,
          },
          required: [
            COLLABORATOR,
            ...followupSchema.required,
            ...secondaryActivitySchema.required,
          ],
          title: '',
          type: 'object',
        },
      },
      title: '',
      type: 'object',
    };
    if (selectedActivity === primaryActivities.childcare || selectedActivity === primaryActivities.napping) {
      delete schema.properties[psk].properties[COLLABORATOR];
      schema.properties[psk].required = [
        ...followupSchema.required,
        ...secondaryActivitySchema.required,
      ];
    }
  }
  else {
    schema = {
      properties: {
        [psk]: {
          dependencies: {
            ...secondaryActivitySchema.dependencies,
          },
          properties: {
            [HAS_FOLLOWUP_QUESTIONS]: {
              default: true,
              type: 'boolean',
            },
            [ACTIVITY_NAME]: {
              default: selectedActivity,
              type: 'string',
            },
            [ACTIVITY_START_TIME]: {
              default: prevStartTime.toLocaleString(DateTime.TIME_24_SIMPLE),
              type: 'string',
            },
            [ACTIVITY_END_TIME]: {
              default: prevEndTime.toLocaleString(DateTime.TIME_24_SIMPLE),
              type: 'string',
            },
            [CAREGIVER]: {
              description: translate(TranslationKeys.CHOOSE_APPLICABLE),
              items: {
                enum: translate(TranslationKeys.CAREGIVER_OPTIONS, { returnObjects: true }),
                type: 'string',
              },
              minItems: 1,
              title: translate(TranslationKeys.CAREGIVER, {
                activity: selectedActivity,
                interpolation: { escapeValue: false },
              }),
              type: 'array',
              uniqueItems: true,
            },
            ...followupSchema.properties,
            ...secondaryActivitySchema.properties,
            [BG_TV_DAY]: {
              enum: translate(TranslationKeys.BG_MEDIA_OPTIONS, { returnObjects: true }),
              title: translate(TranslationKeys.BG_TV_DAY, {
                activity: selectedActivity,
                interpolation: { escapeValue: false },
              }),
              type: 'string',
            },
            [BG_AUDIO_DAY]: {
              enum: translate(TranslationKeys.BG_MEDIA_OPTIONS, { returnObjects: true }),
              title: translate(TranslationKeys.BG_AUDIO_DAY, {
                activity: selectedActivity,
                interpolation: { escapeValue: false },
              }),
              type: 'string',
            },
            [ADULT_MEDIA]: {
              enum: translate(TranslationKeys.BG_MEDIA_OPTIONS, { returnObjects: true }),
              title: translate(TranslationKeys.ADULT_MEDIA, {
                activity: selectedActivity,
                interpolation: { escapeValue: false },
              }),
              type: 'string',
            },
          },
          required: [
            CAREGIVER,
            BG_TV_DAY,
            BG_AUDIO_DAY,
            ADULT_MEDIA,
            ...followupSchema.required,
            ...secondaryActivitySchema.required,
          ],
          title: '',
          type: 'object',
        }
      },
      title: '',
      type: 'object',
    };
  }

  const activities = translate(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });

  if (isSecondaryReadingSelected) {
    merge(
      schema[psk],
      SecondaryFollowUpSchema.createSchema(activities.reading, translate, studySettings, activityDay),
    );
  }

  if (isSecondaryMediaSelected) {
    merge(
      schema[psk],
      SecondaryFollowUpSchema.createSchema(activities.media_use, translate, studySettings, activityDay),
    );
  }

  return schema;
};

const createUiSchema = (pageNum, translate, studySettings, activityDay) => {

  const primaryFollowupOrder = [
    PRIMARY_BOOK_TYPE,
    PRIMARY_BOOK_TITLE,
    PRIMARY_BOOK_LANGUAGE_NON_ENGLISH,
    PRIMARY_BOOK_LANGUAGE,
    PRIMARY_MEDIA_ACTIVITY,
    PRIMARY_MEDIA_AGE,
    PRIMARY_MEDIA_NAME,
    PRIMARY_DEVICE_TYPE,
    PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH,
    PRIMARY_MEDIA_LANGUAGE,
  ];

  const secondaryFollowupOrder = [
    SECONDARY_BOOK_TYPE,
    SECONDARY_BOOK_TITLE,
    SECONDARY_MEDIA_ACTIVITY,
    SECONDARY_MEDIA_AGE,
    SECONDARY_MEDIA_NAME,
  ];

  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);
  if (enableChangesForOSU) {
    return {
      [getPageSectionKey(pageNum, 0)]: {
        classNames: 'column-span-12 grid-container',
        'ui:order': [
          HAS_FOLLOWUP_QUESTIONS,
          ACTIVITY_NAME,
          ACTIVITY_START_TIME,
          ACTIVITY_END_TIME,
          COLLABORATOR,
          ...primaryFollowupOrder,
          OTHER_ACTIVITY,
          SECONDARY_ACTIVITY,
          ...secondaryFollowupOrder,
        ],
        [HAS_FOLLOWUP_QUESTIONS]: {
          classNames: 'hidden'
        },
        [ACTIVITY_NAME]: {
          classNames: 'hidden',
        },
        [ACTIVITY_START_TIME]: {
          classNames: 'hidden'
        },
        [ACTIVITY_END_TIME]: {
          classNames: 'hidden'
        },
        [COLLABORATOR]: {
          classNames: 'column-span-12',
          'ui:widget': 'radio',
        },
        [OTHER_ACTIVITY]: {
          classNames: 'column-span-12',
          'ui:widget': 'radio'
        },
        ...FollowupSchema.createUiSchema(translate),
        ...SecondaryActivitySchema.createUiSchema(translate)
      }
    };
  }

  return {
    [getPageSectionKey(pageNum, 0)]: {
      classNames: 'column-span-12 grid-container',
      'ui:order': [
        HAS_FOLLOWUP_QUESTIONS,
        ACTIVITY_NAME,
        ACTIVITY_START_TIME,
        ACTIVITY_END_TIME,
        CAREGIVER,
        ...primaryFollowupOrder,
        OTHER_ACTIVITY,
        SECONDARY_ACTIVITY,
        ...secondaryFollowupOrder,
        BG_TV_DAY,
        BG_AUDIO_DAY,
        ADULT_MEDIA,
      ],
      [HAS_FOLLOWUP_QUESTIONS]: {
        classNames: 'hidden'
      },
      [ACTIVITY_NAME]: {
        classNames: 'hidden',
      },
      [ACTIVITY_START_TIME]: {
        classNames: 'hidden'
      },
      [ACTIVITY_END_TIME]: {
        classNames: 'hidden'
      },
      [BG_AUDIO_DAY]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio'
      },
      [BG_TV_DAY]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio'
      },
      [ADULT_MEDIA]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio'
      },
      [OTHER_ACTIVITY]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio'
      },
      [CAREGIVER]: {
        classNames: 'column-span-12',
        'ui:widget': 'checkboxes',
        'ui:options': {
          withNone: true,
          noneText: translate(TranslationKeys.NO_ONE)
        }
      },
      [PRIMARY_BOOK_TYPE]: {
        classNames: 'column-span-12',
        'ui:widget': 'checkboxes',
        'ui:options': {
          withOther: 'true'
        }
      },
      [PRIMARY_BOOK_TITLE]: {
        classNames: 'column-span-12'
      },
      ...FollowupSchema.createUiSchema(translate),
      ...SecondaryActivitySchema.createUiSchema(translate)
    }
  };

};

export {
  createSchema,
  createUiSchema
};
