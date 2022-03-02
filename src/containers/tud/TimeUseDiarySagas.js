// @flow

import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  OrderedSet,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { DataUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import DataTypes from './constants/DataTypes';
import {
  DOWNLOAD_ALL_TUD_DATA,
  DOWNLOAD_DAILY_TUD_DATA,
  downloadAllTudData,
  downloadDailyTudData,
} from './TimeUseDiaryActions';
import {
  exportRawDataToCsvFile,
  exportSummarizedDataToCsvFile,
  getOutputFileName
} from './utils';

import * as AppModules from '../../utils/constants/AppModules';
import { selectEntitySetsByModule } from '../../core/edm/EDMUtils';
import {
  ADDRESSES,
  ANSWER,
  QUESTION,
  REGISTERED_FOR,
  SUBMISSION,
  SUMMARY_SET,
  TIME_RANGE
} from '../../core/edm/constants/EntityTemplateNames';
import { PROPERTY_TYPE_FQNS } from '../../core/edm/constants/FullyQualifiedNames';
import type { WorkerResponse } from '../../common/types';

const LOG = new Logger('TimeUseDiarySagas');

const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;

const { getEntityKeyId, getPropertyValue } = DataUtils;

const { OPENLATTICE_ID_FQN } = Constants;

const {
  DATETIME_END_FQN,
  DATETIME_START_FQN,
  ID_FQN,
  VALUES_FQN,
  VARIABLE_FQN,
} = PROPERTY_TYPE_FQNS;

function* downloadSummarizedData(entities, outputFilename) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {

    const submissionIds = entities.map((entity) => entity.get(OPENLATTICE_ID_FQN)).flatten();
    const submissionMetadata = Map(entities.map((entity) => [entity.getIn([OPENLATTICE_ID_FQN, 0]), entity]));

    // entity set ids
    const surveyEntitySets :Map = yield select(selectEntitySetsByModule(AppModules.QUESTIONNAIRES));

    const submissionESID = surveyEntitySets.get(SUBMISSION);
    const registeredForESID = surveyEntitySets.get(REGISTERED_FOR);
    const summarysetESID = surveyEntitySets.get(SUMMARY_SET);

    // filtered search on submissions
    const filter = {
      destinationEntitySetIds: [submissionESID],
      edgeEntitySetIds: [registeredForESID],
      entityKeyIds: submissionIds.toJS(),
      sourceEntitySetIds: [summarysetESID]
    };

    const response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: submissionESID,
        filter,
      })
    );
    if (response.error) throw response.error;

    const csvHeaders = OrderedSet().asMutable();

    // create submissionEKID -> ol.variable -> ol.value map
    const summaryData = Map().withMutations((mutator) => {
      fromJS(response.data).forEach((neighbors, submissionId) => {
        neighbors.forEach((neighbor) => {
          const neighborDetails = neighbor.get('neighborDetails');
          const variable = getPropertyValue(neighborDetails, [VARIABLE_FQN, 0]);
          const value = getPropertyValue(neighborDetails, [VALUES_FQN, 0]);
          mutator.setIn([submissionId, variable], value);
          csvHeaders.add(variable);
        });
      });
    });

    exportSummarizedDataToCsvFile(summaryData, submissionMetadata, csvHeaders.asImmutable(), outputFilename);

    workerResponse = { data: {} };
  }
  catch (error) {
    workerResponse = { error };
  }

  return workerResponse;
}

function* downloadRawData(dataType, entities, outputFilename) :Saga<WorkerResponse> {
  let workerResponse = {};

  try {

    const submissionIds = entities.map((entity) => entity.get(OPENLATTICE_ID_FQN)).flatten();
    const submissionMetadata = Map(entities.map((entity) => [entity.getIn([OPENLATTICE_ID_FQN, 0]), entity]));

    // entity set ids
    const surveyEntitySets :Map = yield select(selectEntitySetsByModule(AppModules.QUESTIONNAIRES));

    const submissionESID = surveyEntitySets.get(SUBMISSION);
    const answersESID = surveyEntitySets.get(ANSWER);
    const registeredForESID = surveyEntitySets.get(REGISTERED_FOR);
    const questionsESID = surveyEntitySets.get(QUESTION);
    const timeRangeESID = surveyEntitySets.get(TIME_RANGE);
    const addressesESID = surveyEntitySets.get(ADDRESSES);

    // filtered neighbor search on submission es to get answers
    let searchFilter = {
      destinationEntitySetIds: [],
      edgeEntitySetIds: [registeredForESID],
      entityKeyIds: submissionIds.toJS(),
      sourceEntitySetIds: [answersESID]
    };

    let response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: submissionESID,
        filter: searchFilter,
      })
    );
    if (response.error) throw response.error;

    // const answersMap = {}; // { answerId -> {ol.values: }}
    const answerSubmissionIdMap = Map().asMutable(); // answerId -> submissionId

    const answersMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighbors :List, submissionId :UUID) => {
        neighbors.forEach((neighbor :Map) => {
          const entity = neighbor.get('neighborDetails');
          const values = getPropertyValue(entity, VALUES_FQN, List());
          const answerId = getEntityKeyId(entity);

          mutator.set(answerId, values);
          answerSubmissionIdMap.set(answerId, submissionId);
        });
      });
    });

    // filtered search on answers to get time range data
    searchFilter = {
      destinationEntitySetIds: [timeRangeESID],
      edgeEntitySetIds: [registeredForESID],
      entityKeyIds: answersMap.keySeq().toJS(),
      sourceEntitySetIds: []
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: answersESID,
        filter: searchFilter,
      })
    );
    if (response.error) throw response.error;

    const answerIdTimeRangeIdMap = Map().asMutable(); // answerId -> submissionId
    const timeRangeValues = Map().withMutations((mutator :Map) => { // submission -> timeRangeId -> { start:, end: }
      fromJS(response.data).forEach((neighbors :List, answerId :UUID) => {

        // each answer has a single registeredFor edge to timerange
        const neighbor = neighbors.first().get('neighborDetails');
        const timeRangeId = getEntityKeyId(neighbor);

        // if timerange neighbor has endtime & startime properties, this is a valid timeRange
        if (neighbor.has(DATETIME_END_FQN) && neighbor.has(DATETIME_START_FQN)) {
          const submissionId = answerSubmissionIdMap.get(answerId);
          answerIdTimeRangeIdMap.set(answerId, timeRangeId);

          mutator
            .setIn([submissionId, timeRangeId, DATETIME_START_FQN], neighbor.get(DATETIME_START_FQN))
            .setIn([submissionId, timeRangeId, DATETIME_END_FQN], neighbor.get(DATETIME_END_FQN));
        }
      });
    });

    // filtered search on answers to get questions
    searchFilter = {
      destinationEntitySetIds: [questionsESID],
      edgeEntitySetIds: [addressesESID],
      entityKeyIds: answersMap.keySeq().toJS(),
      sourceEntitySetIds: []
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: answersESID,
        filter: searchFilter,
      })
    );
    if (response.error) throw response.error;

    const timeRangeQuestionAnswerMap = Map().asMutable(); // submissionId -> timeRangeId -> question code -> answerId
    const nonTimeRangeQuestionAnswerMap = Map().asMutable(); // submissionId -> question code -> answerID

    fromJS(response.data).forEach((neighbors :List, answerId :UUID) => {
      // each answer has a single addresses edge to question
      const submissionId = answerSubmissionIdMap.get(answerId);
      const timeRangeId = answerIdTimeRangeIdMap.get(answerId);

      const neighbor = neighbors.first().get('neighborDetails');
      const questionCode = neighbor.getIn([ID_FQN, 0]);

      if (timeRangeId) {
        timeRangeQuestionAnswerMap.setIn([submissionId, timeRangeId, questionCode], answerId);
      }
      else {
        nonTimeRangeQuestionAnswerMap.setIn([submissionId, questionCode], answerId);
      }
    });

    exportRawDataToCsvFile(
      dataType,
      outputFilename,
      submissionMetadata,
      answersMap,
      nonTimeRangeQuestionAnswerMap,
      timeRangeQuestionAnswerMap,
      timeRangeValues
    );
    workerResponse = { data: null };
  }
  catch (error) {
    workerResponse = { error };
  }

  return workerResponse;
}

function* downloadDailyTudDataWorker(action :SequenceAction) :Saga<*> {
  const {
    dataType,
    date,
    endDate,
    entities,
    startDate
  } = action.value;
  try {
    yield put(downloadDailyTudData.request(action.id, { date, dataType }));

    const outputFilename = getOutputFileName(date, startDate, endDate, dataType);

    let response;
    if (dataType === DataTypes.SUMMARIZED) {
      response = yield call(
        downloadSummarizedData,
        entities,
        outputFilename
      );
    }
    else {
      response = yield call(
        downloadRawData,
        dataType,
        entities,
        outputFilename
      );
    }

    if (response.error) throw response.error;
    yield put(downloadDailyTudData.success(action.id, { date, dataType }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(downloadDailyTudData.failure(action.id, { date, dataType }));
  }

  finally {
    yield put(downloadDailyTudData.finally(action.id));
  }
}

function* downloadDailyTudDataWatcher() :Saga<*> {
  yield takeEvery(DOWNLOAD_DAILY_TUD_DATA, downloadDailyTudDataWorker);
}

function* downloadAllTudDataWorker(action :SequenceAction) :Saga<*> {
  try {
    yield put(downloadAllTudData.request(action.id));

    const {
      dataType,
      date,
      endDate,
      entities,
      startDate
    } = action.value;

    const outputFilename = getOutputFileName(date, startDate, endDate, dataType);

    let response;
    if (dataType === DataTypes.SUMMARIZED) {
      response = yield call(
        downloadSummarizedData,
        entities,
        outputFilename
      );
    }
    else {
      response = yield call(
        downloadRawData,
        dataType,
        entities,
        outputFilename
      );
    }

    if (response.error) throw response.error;
    yield put(downloadAllTudData.success(action.id));
  }

  catch (error) {
    LOG.error(action.type, error);
    yield put(downloadAllTudData.failure(action.id));
  }
  finally {
    yield put(downloadAllTudData.finally(action.id));
  }
}

function* downloadAllTudDataWatcher() :Saga<*> {
  yield takeEvery(DOWNLOAD_ALL_TUD_DATA, downloadAllTudDataWorker);
}

export {
  downloadAllTudDataWatcher,
  downloadDailyTudDataWatcher,
};
