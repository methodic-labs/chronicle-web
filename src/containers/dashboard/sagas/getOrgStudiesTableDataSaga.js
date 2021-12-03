// @flow

import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map } from 'immutable';
import { DataUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import EnrollmentStatuses from '../../../utils/constants/EnrollmentStatus';
import selectOrganization from '../selectors/selectOrganization';
import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import {
  GET_ORG_STUDIES_TABLE_DATA,
  getOrgStudies,
  getOrgStudiesTableData,
  getStudyParticipantsCount,
} from '../actions';
import { getOrgStudiesWorker, getStudyParticipantsCountWorker } from '.';

const { getEntityKeyId, getPropertyValue } = DataUtils;

const { isValidUUID } = ValidationUtils;
const LOG = new Logger('DashboardSagas');

function mergeResponses(responses :WorkerResponse[]) :Map {
  const mergedResponses = Map().withMutations((mutable) => {
    responses.forEach((response) => {
      if (response.data) {
        mutable.merge(response.data);
      }
    });
  });

  return mergedResponses;
}

function countTotalParticipants(countsByType :Map<string, number>) :number {
  return countsByType.reduce((total, count) => total + count, 0);
}

function getOrgStudyTableRows(organization :Map, studies :List<Map>, countsByStudyEKID :Map) :List {

  const rows = studies.map((study) => {
    const studyEntityKeyId = getEntityKeyId(study);
    const studyId = getPropertyValue(study, [PROPERTY_TYPE_FQNS.STUDY_ID, 0]);
    const studyName = getPropertyValue(study, [PROPERTY_TYPE_FQNS.FULL_NAME_FQN, 0]);
    const activeParticipants = countsByStudyEKID.getIn([studyEntityKeyId, EnrollmentStatuses.ENROLLED]);
    const totalParticipants = countTotalParticipants(countsByStudyEKID.get(studyEntityKeyId));

    return {
      activeParticipants,
      id: studyId,
      organization: organization.get('title'),
      study,
      studyId,
      studyName,
      totalParticipants,
    };
  });

  return rows;
}

function* getOrgStudiesTableDataWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    const orgId = action.value;
    if (!isValidUUID(orgId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getOrgStudiesTableData.request(action.id));

    const orgStudiesResponse = yield call(getOrgStudiesWorker, getOrgStudies(orgId));
    if (orgStudiesResponse.error) throw orgStudiesResponse.error;
    const orgStudies :List = orgStudiesResponse.data;

    // get participant counts for each study
    const studyParticipantCountRequests = orgStudies.map((study) => {
      const studyEntityKeyId = getEntityKeyId(study);
      return call(getStudyParticipantsCountWorker, getStudyParticipantsCount({ orgId, studyEntityKeyId }));
    }).toArray();
    const studyParticipantCountResponses :WorkerResponse[] = yield all(studyParticipantCountRequests);
    const countsByStudyEKID = mergeResponses(studyParticipantCountResponses);

    const organization = yield select(selectOrganization(orgId));
    const orgStudyTableData = getOrgStudyTableRows(organization, orgStudies, countsByStudyEKID);

    workerResponse.data = orgStudyTableData;
    yield put(getOrgStudiesTableData.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(getOrgStudiesTableData.failure(action.id, error));
  }
  finally {
    yield put(getOrgStudiesTableData.finally(action.id));
  }

  return workerResponse;
}

function* getOrgStudiesTableDataWatcher() :Saga<void> {
  yield takeLatest(GET_ORG_STUDIES_TABLE_DATA, getOrgStudiesTableDataWorker);
}

export {
  getOrgStudiesTableDataWatcher,
  getOrgStudiesTableDataWorker,
};
