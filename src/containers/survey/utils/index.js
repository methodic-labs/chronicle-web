// @flow
import {
  List,
  Map,
  Set,
  get
} from 'immutable';
import { Constants } from 'lattice';
import { DateTime } from 'luxon';

import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';

const { OPENLATTICE_ID_FQN } = Constants;
const { TITLE_FQN, USER_FQN } = PROPERTY_TYPE_FQNS;

const getAppNameFromUserAppsEntity = (entity :Map) => {
  const titleFQNValues :List = entity.getIn(['entityDetails', 'ol.title'], List());
  if (titleFQNValues.isEmpty()) return '';

  const result = titleFQNValues.find((value) => !value.includes('.'));
  if (result) return result;
  return titleFQNValues.first();
};

const createSurveyFormSchema = (userApps :Map) => {
  const schemaProperties :Object = userApps.map((app) => ({
    title: app.getIn(['entityDetails', TITLE_FQN, 0]),
    description: 'Select all that apply',
    type: 'array',
    uniqueItems: true,
    minItems: 1,
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

const createInitialFormData = (userApps :Map) => userApps
  .map((app) => app.getIn(['associationDetails', USER_FQN], List()))
  .toJS();

const createSubmissionData = (formData :Object) => {
  const entities = Object.entries(formData).map(([entityKeyId, selectedUsers]) => ({
    [OPENLATTICE_ID_FQN]: entityKeyId,
    [USER_FQN.toString()]: selectedUsers
  }));

  /* eslint-disable no-param-reassign */
  return entities.reduce((result, entity) => {
    const entityKeyId = get(entity, OPENLATTICE_ID_FQN);
    delete entity[OPENLATTICE_ID_FQN];
    result[entityKeyId] = entity;
    return result;
  }, {});
  /* eslint-enable */
};

const createHourlySurveySubmissionData = (data :Map, selectedApps :Set, timeRangeSelections :Map) => {
  const user = 'Target Child';

  return List().withMutations((mutator) => {
    data.asMutable().filter((v, k) => selectedApps.has(k)).valueSeq().forEach((mappedValues) => {
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
  });
};

const getMinimumDate = (dates :List) => dates
  .map((date) => DateTime.fromISO(date)).filter((date) => date.isValid).min();

export {
  createHourlySurveySubmissionData,
  createInitialFormData,
  createSubmissionData,
  createSurveyFormSchema,
  getAppNameFromUserAppsEntity,
  getMinimumDate,
};
