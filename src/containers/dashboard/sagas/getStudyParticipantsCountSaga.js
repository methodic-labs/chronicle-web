// @flow

import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import EnrollmentStatuses from '../../../utils/constants/EnrollmentStatus';
import * as AppModules from '../../../utils/constants/AppModules';
import { selectESIDByCollection } from '../../../core/edm/EDMUtils';
import { PARTICIPANTS, PARTICIPATED_IN, STUDIES } from '../../../core/edm/constants/EntityTemplateNames';
import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { GET_STUDY_PARTICIPANTS_COUNT, getStudyParticipantsCount } from '../actions';

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const { isValidUUID } = ValidationUtils;
const LOG = new Logger('DashboardSagas');

function* getStudyParticipantsCountWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    const { orgId, studyEntityKeyId } = action.value;
    if (!isValidUUID(orgId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getStudyParticipantsCount.request(action.id));

    const participatedInESID = yield select(selectESIDByCollection(PARTICIPATED_IN, AppModules.CHRONICLE_CORE, orgId));
    const studyESID = yield select(selectESIDByCollection(STUDIES, AppModules.CHRONICLE_CORE, orgId));
    const participantsESID = yield select(selectESIDByCollection(PARTICIPANTS, AppModules.CHRONICLE_CORE, orgId));

    const searchFilter = {
      destinationEntitySetIds: [studyESID],
      edgeEntitySetIds: [participatedInESID],
      entityKeyIds: [studyEntityKeyId],
      sourceEntitySetIds: [participantsESID]
    };

    const studyNeighborResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: studyESID,
        filter: searchFilter,
      })
    );
    if (studyNeighborResponse.error) throw studyNeighborResponse.error;

    const studyNeighbors :List<Map> = fromJS(studyNeighborResponse.data).get(studyEntityKeyId, List());

    const enrolledCount = {
      [EnrollmentStatuses.ENROLLED]: 0,
      [EnrollmentStatuses.NOT_ENROLLED]: 0,
      [EnrollmentStatuses.DELETE]: 0,
    };
    studyNeighbors.forEach((participant) => {
      // default to ENROLLED if not present
      const status = participant
        .getIn(['associationDetails', PROPERTY_TYPE_FQNS.STATUS, 0], EnrollmentStatuses.ENROLLED);

      if (enrolledCount[status]) {
        enrolledCount[status] += 1;
      }
      else {
        enrolledCount[status] = 1;
      }
    });

    workerResponse.data = fromJS({
      [studyEntityKeyId]: enrolledCount
    });

    yield put(getStudyParticipantsCount.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(getStudyParticipantsCount.failure(action.id, error));
  }
  finally {
    yield put(getStudyParticipantsCount.finally(action.id));
  }

  return workerResponse;
}

function* getStudyParticipantsCountWatcher() :Saga<void> {
  yield takeLatest(GET_STUDY_PARTICIPANTS_COUNT, getStudyParticipantsCountWorker);
}

export {
  getStudyParticipantsCountWatcher,
  getStudyParticipantsCountWorker,
};
