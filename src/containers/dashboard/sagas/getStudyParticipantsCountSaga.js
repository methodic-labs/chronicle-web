// @flow

import { put, takeLatest } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { Logger } from '../../../common/utils';
import { GET_STUDY_PARTICIPANTS_COUNT, getStudyParticipantsCount } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('DashboardSagas');

function* getStudyParticipantsCountWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(getStudyParticipantsCount.request(action.id));
    throw Error('not implemented');
    // const { orgId, studyEntityKeyId } = action.value;
    // if (!isValidUUID(orgId)) throw ERR_ACTION_VALUE_TYPE;
    // yield put(getStudyParticipantsCount.request(action.id));
    //
    // const participatedInESID = yield select(selectESIDByCollection(PARTICIPATED_IN, CHRONICLE_CORE, orgId));
    // const studyESID = yield select(selectESIDByCollection(STUDIES, CHRONICLE_CORE, orgId));
    // const participantsESID = yield select(selectESIDByCollection(PARTICIPANTS, CHRONICLE_CORE, orgId));
    //
    // const searchFilter = {
    //   destinationEntitySetIds: [studyESID],
    //   edgeEntitySetIds: [participatedInESID],
    //   entityKeyIds: [studyEntityKeyId],
    //   sourceEntitySetIds: [participantsESID]
    // };
    //
    // const studyNeighborResponse = yield call(
    //   searchEntityNeighborsWithFilterWorker,
    //   searchEntityNeighborsWithFilter({
    //     entitySetId: studyESID,
    //     filter: searchFilter,
    //   })
    // );
    // if (studyNeighborResponse.error) throw studyNeighborResponse.error;
    //
    // const studyNeighbors :List<Map> = fromJS(studyNeighborResponse.data).get(studyEntityKeyId, List());
    //
    // const enrolledCount = {
    //   [EnrollmentStatuses.ENROLLED]: 0,
    //   [EnrollmentStatuses.NOT_ENROLLED]: 0,
    //   [EnrollmentStatuses.DELETE]: 0,
    // };
    // studyNeighbors.forEach((participant) => {
    //   // default to ENROLLED if not present
    //   const status = participant
    //     .getIn(['associationDetails', PROPERTY_TYPE_FQNS.STATUS, 0], EnrollmentStatuses.ENROLLED);
    //
    //   if (enrolledCount[status]) {
    //     enrolledCount[status] += 1;
    //   }
    //   else {
    //     enrolledCount[status] = 1;
    //   }
    // });
    //
    // workerResponse.data = fromJS({
    //   [studyEntityKeyId]: enrolledCount
    // });
    // yield put(getStudyParticipantsCount.success(action.id, workerResponse.data));
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
