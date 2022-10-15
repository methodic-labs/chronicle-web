// @flow
import {
  List,
  Map,
  Set,
} from 'immutable';
import { DateTime } from 'luxon';

const getAppNameFromUserAppsEntity = (entity :Map) => {
  const titleFQNValues :List = entity.getIn(['entityDetails', 'ol.title'], List());
  if (titleFQNValues.isEmpty()) return '';

  const result = titleFQNValues.find((value) => !value.includes('.'));
  if (result) return result;
  return titleFQNValues.first();
};

const createSurveyFormSchema = (userApps :Map) => {
  const schemaProperties :Object = userApps.map((mappedValues) => ({
    title: mappedValues.first().get('appLabel'),
    description: 'Select all that apply',
    type: 'array',
    uniqueItems: true,
    items: {
      type: 'string',
      enum: ['Parent alone', 'Child alone', 'Parent and child together', 'Other family member']
    }
  })).toJS();

  /* eslint-disable no-param-reassign, no-unused-vars */
  const uiSchemaObjects = Object.entries(schemaProperties).reduce((result, [key, val]) => {
    result[key] = {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        noneText: "I don't know",
        row: true,
        withNone: true,
      }
    };
    return result;
  }, {});
  /* eslint-enable */

  const uiSchema = {
    classNames: 'column-span-12',
    ...uiSchemaObjects
  };

  const schema = {
    type: 'object',
    title: '',
    properties: {
      ...schemaProperties
    }
  };

  return {
    schema,
    uiSchema
  };
};

// const createInitialFormData = (userApps :Map) => userApps
//   .map((app) => app.getIn(['associationDetails', USER_FQN], List()))
//   .toJS();

const createSubmissionData = (formData :Object, userApps :Map) => {
  const unknown = "I don't know";
  return List().withMutations((mutator) => {
    userApps
      .filter((mappedValues, appName) => appName in formData && formData[appName][0] !== unknown)
      .forEach((usages, appName) => {
        usages.forEach((usage) => {
          const updated = usage.set('users', List(formData[appName]));
          mutator.push(updated);
        });
      });
  }).toJS();
};

const createHourlySurveySubmissionData = (data :Map, selectedApps :Set, timeRangeSelections :Map) => {
  const user = 'Target Child';

  return List().withMutations((mutator) => {
    data.filter((v, k) => selectedApps.has(k)).valueSeq().forEach((mappedValues) => {
      mappedValues.get('data').valueSeq().forEach((usages) => {
        usages.forEach((usage) => {
          const updated = usage.set('users', List([user]));
          mutator.push(updated);
        });
      });
    });

    timeRangeSelections.forEach((selections, appName) => {
      selections.forEach((timeRange) => {
        data.getIn([appName, 'data', timeRange]).forEach((usage) => {
          const updated = usage.set('users', List([user]));
          mutator.push(updated);
        });
      });
    });
  }).toJS();
};

const getMinimumDate = (dates :List) => dates
  .map((date) => DateTime.fromISO(date)).filter((date) => date.isValid).min();

export {
  createHourlySurveySubmissionData,
  createSubmissionData,
  createSurveyFormSchema,
  getAppNameFromUserAppsEntity,
  getMinimumDate,
};
