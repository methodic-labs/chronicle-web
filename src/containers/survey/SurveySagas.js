// @flow

import {
  call,
  put,
  takeEvery,
  takeLatest
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  getIn
} from 'immutable';
import { Constants } from 'lattice';
import { Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_CHRONICLE_APPS_DATA,
  SUBMIT_SURVEY,
  getChronicleAppsData,
  submitSurvey,
} from './SurveyActions';
import { createSubmissionData, getAppNameFromUserAppsEntity, getMinimumDate } from './utils';

import AppUsageFreqTypes from '../../utils/constants/AppUsageFreqTypes';
import * as ChronicleApi from '../../utils/api/ChronicleApi';
import { PROPERTY_TYPE_FQNS } from '../../core/edm/constants/FullyQualifiedNames';

const { OPENLATTICE_ID_FQN } = Constants;
const LOG = new Logger('SurveySagas');

const { DATE_TIME_FQN, TITLE_FQN, FULL_NAME_FQN } = PROPERTY_TYPE_FQNS;

/*
 *
 * SurveyActions.submitSurvey()
 *
 */
function* submitSurveyWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(submitSurvey.request(action.id));

    const { value } = action;
    const {
      formData,
      organizationId,
      participantId,
      studyId,
    } = value;

    const submissionData = createSubmissionData(formData);

    const response = yield call(
      ChronicleApi.updateAppsUsageAssociationData, organizationId, studyId, participantId, submissionData
    );
    if (response.error) throw response.error;

    yield put(submitSurvey.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitSurvey.failure(action.id));
  }
  finally {
    yield put(submitSurvey.finally(action.id));
  }
}

function* submitSurveyWatcher() :Generator<*, *, *> {
  yield takeEvery(SUBMIT_SURVEY, submitSurveyWorker);
}

/*
 *
 * SurveyActions.getChronicleApps()
 *
 */
function* getChronicleUserAppsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getChronicleAppsData.request(action.id));

    const { value } = action;
    const {
      date,
      participantId,
      studyId,
      organizationId,
      appUsageFreqType
    } = value;

    const response = yield call(ChronicleApi.getParticipantAppsUsageData, date, participantId, studyId, organizationId);
    if (response.error) throw response.error;

    /*
    {
     fullname: {
      [title_fqn]: blah blah,
      entities: [{
        [association ekid]: {
          [date_time_fqn]: 'blah blah'
        }
      }]
    }
    }
    */

    let appsData;
    if (appUsageFreqType === AppUsageFreqTypes.HOURLY) {
      appsData = Map().withMutations((mutator :Map) => {
        response.data.forEach((entry) => {
          const { entityDetails, associationDetails } = entry;
          const fullName = getIn(entityDetails, [FULL_NAME_FQN, 0]);
          const title = getIn(entityDetails, [TITLE_FQN, 0]);
          const associationEKID = getIn(associationDetails, [OPENLATTICE_ID_FQN, 0]);
          const dateTime = getIn(associationDetails, [DATE_TIME_FQN, 0]);

          const entity = {
            [associationEKID]: {
              [DATE_TIME_FQN]: dateTime
            }
          };

          mutator
            .setIn([fullName, TITLE_FQN], title)
            .updateIn([fullName, 'entities'], List(), (current) => current.push(fromJS(entity)));
        });
      });
    }
    else {
      // mapping from association EKID -> associationDetails & entityDetails
      appsData = fromJS(response.data)
        .toMap()
        .mapKeys((index, entity) => entity.getIn(['associationDetails', OPENLATTICE_ID_FQN, 0]))
        .map((entity, id) => entity.set('id', id))
        .map((entity) => entity.setIn(['entityDetails', TITLE_FQN, 0], getAppNameFromUserAppsEntity(entity)))
        .map((entity) => entity.setIn(['associationDetails', DATE_TIME_FQN],
          [getMinimumDate(entity.getIn(['associationDetails', DATE_TIME_FQN]))]))
        .sortBy((entity) => DateTime.fromISO(entity.getIn(['associationDetails', DATE_TIME_FQN, 0])));
    }

    yield put(getChronicleAppsData.success(action.id, appsData));
  }

  catch (error) {
    LOG.error(action.type, error);
    yield put(getChronicleAppsData.failure(action.id));
  }
  finally {
    yield put(getChronicleAppsData.finally(action.id));
  }
}

function* getChronicleUserAppsWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_CHRONICLE_APPS_DATA, getChronicleUserAppsWorker);
}

export {
  getChronicleUserAppsWatcher,
  submitSurveyWatcher
};
