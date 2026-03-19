/*
 * @flow
 */

import isFunction from 'lodash/isFunction';
import isInteger from 'lodash/isInteger';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import transform from 'lodash/transform';
import {
  List,
  Map,
  get,
  getIn,
  hasIn,
  set,
} from 'immutable';

import Logger from './Logger';
import {
  isDefined,
  isDigitOnlyString,
  isEmptyImmutableMap,
  isEmptyObject,
  isNonEmptyString,
} from './LangUtils';
import {
  isObjectOrMap,
  isValidUUID,
  validateArrayOrListWith,
} from './ValidationUtils';

import type { UUID } from '../types';

const LOG :Logger = new Logger('DataProcessingUtils');

const ATAT :string = '__@@__';
const KEY_MAPPERS :'KEY_MAPPERS' = 'KEY_MAPPERS';
const INDEX_MAPPERS :'INDEX_MAPPERS' = 'INDEX_MAPPERS';
const VALUE_MAPPERS :'VALUE_MAPPERS' = 'VALUE_MAPPERS';
const ENTITY_ADDRESS_KEY_PARTS = 3;

type IndexOrId = number | UUID;
type EntityData = { [UUID] :any[] };
type EdgeDefinition = [string, IndexOrId, string, IndexOrId, string, EntityData];

type EntityAddress = {|
  entityIndex ?:number;
  entityKeyId ?:UUID;
  entitySetName :string;
  propertyTypeFQN :string;
|};

function getPageSectionKey(page :number, section :number) :string {
  return `page${page}section${section}`;
}

const PAGE_SECTION_REGEX = /^page(?<page>\d*)section(?<section>\d*)$/;

function isValidPageSectionKey(key :string) :boolean {
  return PAGE_SECTION_REGEX.test(key);
}

function parsePageSectionKey(key :string) :{page :string, section :string} | void {
  if (!isValidPageSectionKey(key)) {
    const errorMsg = 'invalid param: key must be a valid pageSection';
    LOG.error(errorMsg, key);
    throw new Error(errorMsg);
  }

  const matches = key.match(PAGE_SECTION_REGEX);
  if (!matches) return undefined;

  if (typeof matches === 'object' && matches.groups) return matches.groups;

  return undefined;
}

function getEntityAddressKey(
  indexOrEntityKeyId :IndexOrId,
  entitySetName :string,
  fqn :string
) :string {

  let errorMsg :string = '';

  if (!isInteger(indexOrEntityKeyId) && !isValidUUID(indexOrEntityKeyId)) {
    errorMsg = 'invalid param: indexOrEntityKeyId must be either an integer or a UUID';
    LOG.error(errorMsg, indexOrEntityKeyId);
    throw new Error(errorMsg);
  }

  if (!isNonEmptyString(entitySetName)) {
    errorMsg = 'invalid param: entitySetName must be a non-empty string';
    LOG.error(errorMsg, entitySetName);
    throw new Error(errorMsg);
  }

  if (!isNonEmptyString(fqn)) {
    errorMsg = 'invalid param: fqn must be a non-empty string';
    LOG.error(errorMsg, fqn);
    throw new Error(errorMsg);
  }

  return `${indexOrEntityKeyId}${ATAT}${entitySetName.toString()}${ATAT}${fqn.toString()}`;
}

function parseEntityAddressKey(entityAddressKey :string) :EntityAddress {

  const split :string[] = entityAddressKey.split(ATAT);

  if (split && split.length === ENTITY_ADDRESS_KEY_PARTS) {
    const entityIndex :number = parseInt(split[0], 10); // WARNING! see comment below
    const entityKeyId :UUID = split[0];
    const entitySetName :string = split[1];
    const propertyTypeFQN :string = split[2];
    if (isNonEmptyString(entitySetName) && isNonEmptyString(propertyTypeFQN)) {
      if (isValidUUID(entityKeyId)) {
        return {
          entityKeyId,
          entitySetName,
          propertyTypeFQN,
        };
      }
      /*
       * WARNING: parseInt() will incorrectly return a number when given certain UUID strings. for example:
       *   parseInt('9b93bc80-79c3-44c8-807c-ada1a8d6484f') // returns 9
       *   parseInt('-9b93bc80-79c3-44c8-807c-ada1a8d6484f') // returns -9
       *
       * thus, isValidUUID() MUST happen first (above) to handle the first example, and isDigitOnlyString() will
       * handle the second example below
       */
      if (
        isDigitOnlyString(split[0])
        || (
          split[0].startsWith('-') && isDigitOnlyString(split[0].slice(1))
        )
      ) {
        return {
          entityIndex,
          entitySetName,
          propertyTypeFQN,
        };
      }
    }
  }

  const errorMsg :string = 'unable to parse entity address key';
  LOG.error(errorMsg, entityAddressKey);
  throw new Error(errorMsg);
}

function isValidEntityAddressKey(value :any) :boolean {

  if (!isNonEmptyString(value)) {
    return false;
  }

  const split :string[] = value.split(ATAT);

  if (split && split.length === ENTITY_ADDRESS_KEY_PARTS) {
    // NOTE: be careful! parseInt() will incorrectly return a number when given certain UUID strings
    const entityIndex :number = parseInt(split[0], 10);
    const entityKeyId :UUID = split[0];
    const entitySetName :string = split[1];
    const propertyTypeFQN :string = split[2];
    if (!isNonEmptyString(entitySetName)) {
      return false;
    }
    if (isNonEmptyString(propertyTypeFQN)) {
      if (isValidUUID(entityKeyId)) {
        return true;
      }
      if (entityIndex < 0 || (isDigitOnlyString(split[0]) && isInteger(entityIndex))) {
        return true;
      }
    }
  }

  return false;
}

function processEntityIndex(key :string, index :?number, mappers :Map | Object) :number {

  let { entityIndex } = parseEntityAddressKey(key);

  if (typeof entityIndex === 'number' && entityIndex >= 0) {
    return entityIndex;
  }

  if (typeof index === 'number' && index >= 0) {
    entityIndex = index;
  }

  if (hasIn(mappers, [INDEX_MAPPERS, key])) {
    const indexMapper = getIn(mappers, [INDEX_MAPPERS, key]);
    if (isFunction(indexMapper)) {
      entityIndex = indexMapper(index);
    }
    else {
      LOG.warn('processEntityIndex() - mapper is not a function', key);
    }
  }

  if (typeof entityIndex !== 'number') {
    LOG.error('processEntityIndex() - unable to process entity index', key);
    return -1;
  }

  return entityIndex;
}

function processEntityValue(key :string, value :any, mappers :Map | Object) :any {

  let processedValue :any = value;

  if (hasIn(mappers, [VALUE_MAPPERS, key])) {
    const valueMapper = getIn(mappers, [VALUE_MAPPERS, key]);
    if (isFunction(valueMapper)) {
      // TODO: what params should be passed along to the mapper?
      processedValue = valueMapper(processedValue);
    }
    else {
      LOG.warn('processEntityValue() - mapper is not a function');
    }
  }

  if (isDefined(processedValue)) {
    if (Array.isArray(processedValue)) {
      return processedValue;
    }
    if (List.isList(processedValue)) {
      return processedValue.toJS();
    }
    return [processedValue];
  }

  // TODO: what should be returned here?
  LOG.warn('processEntityValue() - unable to process value', processedValue);
  return undefined;
}

function processEntityValueMap(
  entitySetIds :Object | Map,
  propertyTypeIds :Object | Map,
  mappers :Object | Map,
  processedData :Object | Map,
  valueMap :Object | Map,
  listIndex :?number,
) {

  if (!isPlainObject(valueMap) && !Map.isMap(valueMap)) {
    LOG.warn('processEntityValueMap() - expected value to be an object/immutable map', valueMap);
    return processedData;
  }

  if (isEmptyObject(valueMap) || isEmptyImmutableMap(valueMap)) {
    return processedData;
  }

  let localProcessedData :Map | Object = processedData;

  const entrySequence = isPlainObject(valueMap) ? Object.entries(valueMap) : valueMap.entrySeq();
  entrySequence.forEach(([key, valueInMap]) => {
    let localValue :Object | Map = valueInMap;
    if (isValidEntityAddressKey(key) && hasIn(mappers, [KEY_MAPPERS, key])) {
      const mapper = getIn(mappers, [KEY_MAPPERS, key]);
      if (isFunction(mapper)) {
        localValue = mapper(valueInMap);
      }
      else {
        LOG.warn('processEntityValueMap() - mapper is not a function');
      }
    }

    if (isPlainObject(localValue) || Map.isMap(localValue)) {
      if (typeof listIndex === 'number') {
        // NOTE: we pass along the list index for nested maps
        // TODO: this behavior needs to be better defined for deeply nested structures
        localProcessedData = processEntityValueMap(
          entitySetIds,
          propertyTypeIds,
          mappers,
          localProcessedData,
          localValue,
          listIndex
        );
      }
      else {
        localProcessedData = processEntityValueMap(
          entitySetIds,
          propertyTypeIds,
          mappers,
          localProcessedData,
          localValue,
          undefined
        );
      }
    }
    // if value is an array/list of object/map
    else if (validateArrayOrListWith(localValue, isObjectOrMap)) {
      localValue.forEach((valueInList :Map, index :number) => {
        // NOTE: the index is meant to represent the entity index, but it's not guaranteed to be the correct index
        // TODO: this behavior needs to be better defined for deeply nested structures
        localProcessedData = processEntityValueMap(
          entitySetIds,
          propertyTypeIds,
          mappers,
          localProcessedData,
          valueInList,
          index
        );
      });
    }
    else {

      const { entitySetName, propertyTypeFQN } = parseEntityAddressKey(key);
      const entitySetId :UUID = get(entitySetIds, entitySetName);
      const propertyTypeId :UUID = get(propertyTypeIds, propertyTypeFQN);

      const entityIndex :number = processEntityIndex(key, listIndex, mappers);
      const processedValue :any = processEntityValue(key, localValue, mappers);
      let entities :Object[] = get(localProcessedData, entitySetId, []);
      let entity :Object = get(entities, entityIndex, {});

      // NOTE: entity is "undefined" when the data gets processed in a random order
      if (!isDefined(entity)) {
        entity = {};
      }

      if (isDefined(processedValue)) {
        entity = set(entity, propertyTypeId, processedValue);
      }

      entities = set(entities, entityIndex, entity);
      localProcessedData = set(localProcessedData, entitySetId, entities);
    }
  });

  return localProcessedData;
}

/*
 * the given data is expected to structured similarly to this:
 *
 *   {
 *     "page1_section1": {
 *       "0__@@__ESN1__@@__FQN1": "value1",
 *       "0__@@__ESN1__@@__FQN2": "value2",
 *     },
 *     "page1_section2": {
 *       "0__@@__ESN2__@@__FQN3": "value3",
 *       "0__@@__ESN2__@@__FQN4": "value4",
 *     },
 *     "page1_section3": [
 *       {
 *         "-1__@@__ESN3__@@__FQN5": "value5",
 *         "-1__@@__ESN3__@@__FQN6": "value6",
 *       }
 *     ],
 *   }
 *
 * the "page1_section1" keys are ignored. the "__@@__" keys are the hacky strings that hold hints for correctly
 * processing the entity data.
 */
function processEntityData(
  data :Object | Map,
  entitySetIds :Object | Map, // { <entitySetName>: <UUID> }
  propertyTypeIds :Object | Map, // { <propertyTypeFQN>: <UUID> }
  mappers :Object | Map = {}
) :Object {

  if (isEmptyObject(data) || isEmptyImmutableMap(data)) {
    const errorMsg :string = '"data" param must be a non-empty object or immutable map';
    LOG.error(errorMsg, data);
    throw new Error(errorMsg);
  }

  if (isEmptyObject(entitySetIds) || isEmptyImmutableMap(entitySetIds)) {
    const errorMsg :string = '"entitySetIds" param must be a non-empty object or immutable map';
    LOG.error(errorMsg, entitySetIds);
    throw new Error(errorMsg);
  }

  if (isEmptyObject(propertyTypeIds) || isEmptyImmutableMap(propertyTypeIds)) {
    const errorMsg :string = '"propertyTypeIds" param must be a non-empty object or immutable map';
    LOG.error(errorMsg, propertyTypeIds);
    throw new Error(errorMsg);
  }

  if (!(isPlainObject(mappers) || Map.isMap(mappers))) {
    const errorMsg :string = '"mappers" param must be an object or immutable map';
    LOG.error(errorMsg, mappers);
    throw new Error(errorMsg);
  }

  let processedData = {};

  const valueSequence = Map.isMap(data) ? data.valueSeq() : Object.values(data);
  valueSequence
    .forEach((value :any) => {
      if (List.isList(value) || Array.isArray(value)) {
        value.forEach((valueMap :Map | Object, index :number) => {
          processedData = processEntityValueMap(entitySetIds, propertyTypeIds, mappers, processedData, valueMap, index);
        });
      }
      else {
        processedData = processEntityValueMap(entitySetIds, propertyTypeIds, mappers, processedData, value, undefined);
      }
    });

  return processedData;
}

function processAssociationEntityData(
  data :EdgeDefinition[] | List,
  entitySetIds :Object | Map, // { <entitySetName>: <UUID> }
  propertyTypeIds :Object | Map, // { <propertyTypeFQN>: <UUID> }
) :Object {

  let processedData = {};

  data.forEach((parts) => {
    const edgeEntitySetName :string = get(parts, 0);
    const edgeEntitySetId :UUID = get(entitySetIds, edgeEntitySetName);

    const sourceIndexOrId :IndexOrId = get(parts, 1);
    const sourceEntitySetName :string = get(parts, 2);
    const sourceEntitySetId :UUID = get(entitySetIds, sourceEntitySetName);

    const destinationIndexOrId :IndexOrId = get(parts, 3);
    const destinationEntitySetName :string = get(parts, 4);
    const destinationEntitySetId :UUID = get(entitySetIds, destinationEntitySetName);

    const rawAssociationData :Object | Map = get(parts, 5, {});
    const associationData = Map.isMap(rawAssociationData)
      ? rawAssociationData.mapKeys((key :string) => get(propertyTypeIds, key)).toJS()
      : mapKeys(rawAssociationData, (value :any, key :string) => get(propertyTypeIds, key));

    const associationEntity = {};
    associationEntity.data = associationData;
    associationEntity.srcEntitySetId = sourceEntitySetId;
    associationEntity.dstEntitySetId = destinationEntitySetId;

    if (isValidUUID(sourceIndexOrId)) {
      associationEntity.srcEntityKeyId = sourceIndexOrId;
    }
    else if (isInteger(sourceIndexOrId) && sourceIndexOrId >= 0) {
      associationEntity.srcEntityIndex = sourceIndexOrId;
    }
    else {
      LOG.error('unable to set neither "srcEntityIndex" nor "srcEntityKeyId"', sourceIndexOrId);
    }

    if (isValidUUID(destinationIndexOrId)) {
      associationEntity.dstEntityKeyId = destinationIndexOrId;
    }
    else if (isInteger(destinationIndexOrId) && destinationIndexOrId >= 0) {
      associationEntity.dstEntityIndex = destinationIndexOrId;
    }
    else {
      LOG.error('unable to set neither "dstEntityIndex" nor "dstEntityKeyId"', destinationIndexOrId);
    }

    const associations :Object[] = get(processedData, edgeEntitySetId, []);
    associations.push(associationEntity);
    processedData = set(processedData, edgeEntitySetId, associations);
  });

  return processedData;
}

function processEntityDataForPartialReplace(
  data :Object | Map,
  originalData :Object | Map,
  entitySetIds :Object | Map, // { <entitySetName>: <UUID> }
  propertyTypeIds :Object | Map, // { <propertyTypeFQN>: <UUID> }
  mappers :Object | Map = {}
) :{} {

  // NOTE: not yet ready to use for more general cases

  let processedData = {};
  let diffData = {};

  const entitySequence = Map.isMap(data) ? data.entrySeq() : Object.entries(data);
  entitySequence
  // eslint-disable-next-line no-unused-vars
    .filter(([key, entityData] :[string, Object | Map]) => isPlainObject(entityData) || Map.isMap(entityData))
    .forEach(([pageSectionKey, entityData] :[string, Object | Map]) => {
      const propertySequence = Map.isMap(entityData) ? entityData.entrySeq() : Object.entries(entityData);
      propertySequence.forEach(([entityAddressKey, value] :[string, Object | Map]) => {
        const key = [pageSectionKey, entityAddressKey];
        const originalValue :any = getIn(originalData, key);

        if (value !== originalValue) {
          diffData = set(diffData, entityAddressKey, value);
        }
      });
    });

  Object.entries(diffData).forEach(([key, valueInMap]) => {
    let localValue = valueInMap;
    if (isValidEntityAddressKey(key)) {
      if (hasIn(mappers, [KEY_MAPPERS, key])) {
        const mapper = getIn(mappers, [KEY_MAPPERS, key]);
        if (isFunction(mapper)) {
          localValue = mapper(valueInMap);
        }
        else {
          LOG.warn('processEntityValueMap() - mapper is not a function');
        }
      }

      const {
        entityIndex,
        entityKeyId,
        entitySetName,
        propertyTypeFQN,
      } = parseEntityAddressKey(key);
      const indexOrId = entityKeyId || entityIndex;
      const entitySetId :UUID = get(entitySetIds, entitySetName);
      const propertyTypeId :UUID = get(propertyTypeIds, propertyTypeFQN);

      const processedValue :any = processEntityValue(key, localValue, mappers);
      let entitySetData :Object | Map = get(processedData, entitySetId, {});
      let entity :Object | Map = get(entitySetData, indexOrId, {});

      if (isDefined(processedValue)) {
        entity = set(entity, propertyTypeId, processedValue);
      }
      else {
        entity = set(entity, propertyTypeId, []);
      }

      entitySetData = set(entitySetData, indexOrId, entity);
      processedData = set(processedData, entitySetId, entitySetData);
    }
  });

  return processedData;
}

type Replacer = (key :string) => string;

const replaceEntityAddressKeys = (input :Object | Map, replacer :Replacer) => {
  if (!Map.isMap(input) && !isPlainObject(input)) {
    return input;
  }

  if (Map.isMap(input)) {
    return input.mapEntries(([key, value]) => [
      replacer(key),
      replaceEntityAddressKeys(value, replacer)
    ]);
  }

  return transform(input, (result :Object, value :any, key :string) => {
    const newKey = replacer(key);
    const newValue = replaceEntityAddressKeys(value, replacer);

    /* eslint no-param-reassign: ["error", { "props": false }] */
    result[newKey] = newValue;
    return result;
  }, {});
};

const getEntityKeyIdsByEntitySetId = (data :Object, entitySetIds :Object) :{ [string] :Set<UUID> } => {

  const EKIDsBySet :{ [string] :Set<UUID> } = transform(data, (result :Object, value :any, key :string) => {
    if (isValidEntityAddressKey(key)) {
      const {
        entityKeyId,
        entitySetName
      } = parseEntityAddressKey(key);

      const entitySetId = get(entitySetIds, entitySetName);
      if (entitySetId) {
        (result[entitySetId] || (result[entitySetId] = new Set())).add(entityKeyId);
      }
      else {
        LOG.error('getEntityKeyIdsByEntitySetId: entity set id not found');
      }
    }
  }, {});
  return EKIDsBySet;
};

const wrapFormDataInPageSection = (formData :Object, pageSection :string = getPageSectionKey(1, 1)) => {
  if (!isValidPageSectionKey(pageSection)) {
    throw Error('invalid "pageSection" param');
  }

  let formattedFormData = {};
  formattedFormData = set(formattedFormData, pageSection, formData);
  return formattedFormData;
};

const parseIdSchemaPath = (idSchema :Object) => {
  const path = idSchema.$id.split('_');
  path.shift();

  return path;
};

const findEntityAddressKeyFromMap = (entityIndexToIdMap :Object, arrayIndex ?:number = 0) => (key :string) :string => {

  if (isValidEntityAddressKey(key)) {
    const {
      entityIndex,
      entitySetName,
      propertyTypeFQN
    } :EntityAddress = parseEntityAddressKey(key);

    let entityKeyId = getIn(entityIndexToIdMap, [entitySetName, entityIndex]);
    if (!isValidUUID(entityKeyId)) {
      entityKeyId = getIn(entityIndexToIdMap, [entitySetName, entityIndex, arrayIndex]);
    }

    if (isValidUUID(entityKeyId)) {
      return getEntityAddressKey(entityKeyId, entitySetName, propertyTypeFQN);
    }
  }
  return key;
};

export {
  ATAT,
  INDEX_MAPPERS,
  KEY_MAPPERS,
  VALUE_MAPPERS,
  findEntityAddressKeyFromMap,
  getEntityAddressKey,
  getEntityKeyIdsByEntitySetId,
  getPageSectionKey,
  isValidEntityAddressKey,
  isValidPageSectionKey,
  parseEntityAddressKey,
  parseIdSchemaPath,
  parsePageSectionKey,
  processAssociationEntityData,
  processEntityData,
  processEntityDataForPartialReplace,
  processEntityValue,
  processEntityValueMap,
  replaceEntityAddressKeys,
  wrapFormDataInPageSection,
};

export type {
  EdgeDefinition,
  IndexOrId,
  EntityAddress,
  EntityData,
};
