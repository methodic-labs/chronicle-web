// @flow

import { Map } from 'immutable';

import { OTHER_ACTIVITY, SECONDARY_ACTIVITY } from '../../../common/constants';
import TranslationKeys from '../constants/TranslationKeys';
import * as SecondaryFollowUpSchema from './SecondaryFollowUpSchema';

const getSecondaryActivityOptions = (primaryActivity :string, trans :TranslationFunction, studySettings :Map) => {

  const primaryActivities :Object = trans(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });
  // $FlowIgnore
  const primaryActivityOptions :string[] = Object.values(primaryActivities);
  let secondaryActivityOptions :string[] = primaryActivityOptions.filter((activity) => activity !== primaryActivity);

  const enableChangesForSherbrookeUniversity = studySettings
    .getIn(['TimeUseDiary', 'enableChangesForSherbrookeUniversity']) || false;

  if (enableChangesForSherbrookeUniversity) {
    switch (primaryActivity) {
      case primaryActivities.childcare:
      case primaryActivities.napping:
        secondaryActivityOptions = [];
        break;
      case primaryActivities.eating:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
          && activity !== primaryActivities.napping
          && activity !== primaryActivities.grooming
          && activity !== primaryActivities.other
        ));
        break;
      case primaryActivities.media_use:
      case primaryActivities.reading:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
        ));
        break;
      case primaryActivities.indoor:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
          && activity !== primaryActivities.outdoor
        ));
        break;
      case primaryActivities.outdoor:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
          && activity !== primaryActivities.indoor
          && activity !== primaryActivities.grooming
        ));
        break;
      case primaryActivities.grooming:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
          && activity !== primaryActivities.napping
          && activity !== primaryActivities.eating
        ));
        break;
      case primaryActivities.other:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
          && activity !== primaryActivities.outdoors
        ));
        break;
      case primaryActivities.outdoors:
        secondaryActivityOptions = secondaryActivityOptions.filter((activity) => (
          activity !== primaryActivities.childcare
          && activity !== primaryActivities.other
        ));
        break;
      default:
        break;
    }
  }

  return secondaryActivityOptions;
};

const createSchema = (primaryActivity :string, trans :TranslationFunction, studySettings :Map) => {

  const secondaryActivityOptions = getSecondaryActivityOptions(primaryActivity, trans, studySettings);
  if (secondaryActivityOptions.length === 0) {
    return {
      dependencies: {},
      properties: {},
      required: [],
    };
  }

  return {
    properties: {
      [OTHER_ACTIVITY]: {
        type: 'string',
        title: trans(TranslationKeys.OTHER_ACTIVITY, {
          activity: primaryActivity,
          interpolation: { escapeValue: false }
        }),
        enum: [trans(TranslationKeys.YES), trans(TranslationKeys.NO), trans(TranslationKeys.DONT_KNOW)]
      }
    },
    required: secondaryActivityOptions.length === 0 ? [] : [OTHER_ACTIVITY],
    dependencies: {
      [OTHER_ACTIVITY]: {
        oneOf: [
          {
            properties: {
              [OTHER_ACTIVITY]: {
                enum: [trans(TranslationKeys.NO), trans(TranslationKeys.DONT_KNOW)]
              },
            }
          },
          {
            properties: {
              [OTHER_ACTIVITY]: {
                enum: [trans(TranslationKeys.YES)]
              },
              [SECONDARY_ACTIVITY]: {
                title: trans(TranslationKeys.SECONDARY_ACTIVITY, {
                  activity: primaryActivity,
                  interpolation: { escapeValue: false }
                }),
                description: trans(TranslationKeys.CHOOSE_APPLICABLE),
                type: 'array',
                items: {
                  enum: secondaryActivityOptions,
                  type: 'string'
                },
                uniqueItems: true,
                minItems: 1
              }
            },
            required: [SECONDARY_ACTIVITY],
          }
        ]
      }
    },
  };
};

const createUiSchema = (trans :TranslationFunction) => ({
  [SECONDARY_ACTIVITY]: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes'
  },
  [OTHER_ACTIVITY]: {
    classNames: 'column-span-12',
    'ui:widget': 'radio'
  },
  ...SecondaryFollowUpSchema.createUiSchema(trans)
});

export {
  createSchema,
  createUiSchema
};
