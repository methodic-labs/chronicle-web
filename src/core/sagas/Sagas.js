/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';

import * as AppSagas from '../../containers/app/sagas';
import * as AppUsageSurveySagas from '../../containers/survey/sagas';
import * as AuthSagas from '../auth/sagas';
import * as DashboardSagas from '../../containers/dashboard/sagas';
import * as DeviceUsageSurveySagas from '../../containers/deviceusagesurvey/sagas';
import * as RoutingSagas from '../router/RoutingSagas';
import * as StudySagas from '../../containers/study/sagas';
import * as TimeUseDiarySagas from '../../containers/tud/sagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([
    // AuthSagas
    fork(AuthSagas.authAttemptWatcher),
    fork(AuthSagas.authExpiredWatcher),
    fork(AuthSagas.authFailureWatcher),
    fork(AuthSagas.authSuccessWatcher),
    fork(AuthSagas.logoutWatcher),

    // AppSagas
    fork(AppSagas.initializeApplicationWatcher),
    fork(AppSagas.switchOrganizationWatcher),

    // DataSagas
    // fork(DataSagas.submitDataGraphWatcher),
    // fork(DataSagas.submitPartialReplaceWatcher),

    // EDMSagas
    // fork(EDMSagas.getEntityDataModelTypesWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),

    // StudiesSagas
    fork(StudySagas.changeEnrollmentStatusWatcher),
    fork(StudySagas.createStudyWatcher),
    fork(StudySagas.deleteStudyWatcher),
    fork(StudySagas.deleteStudyParticipantsWatcher),
    fork(StudySagas.getAllStudiesWatcher),
    fork(StudySagas.getStudyParticipantsWatcher),
    fork(StudySagas.getStudySettingsWatcher),
    fork(StudySagas.initializeStudyWatcher),
    fork(StudySagas.registerParticipantWatcher),
    fork(StudySagas.verifyParticipantWatcher),
    // fork(StudiesSagas.deleteStudyWatcher),
    fork(StudySagas.updateStudyWatcher),

    // apps usage survey
    fork(AppUsageSurveySagas.getAppUsageSurveyDataWatcher),
    fork(AppUsageSurveySagas.submitAppUsageSurveyWatcher),

    // device usage survey
    fork(DeviceUsageSurveySagas.getDeviceUsageSurveyDataWatcher),

    // questionnaire
    // fork(QuestionnaireSagas.changeActiveStatusWatcher),
    // fork(QuestionnaireSagas.createQuestionnaireWatcher),
    // fork(QuestionnaireSagas.deleteQuestionnaireWatcher),
    // fork(QuestionnaireSagas.downloadQuestionnaireResponsesWatcher),
    // fork(QuestionnaireSagas.getQuestionnaireResponsesWatcher),
    // fork(QuestionnaireSagas.getQuestionnaireWatcher),
    // fork(QuestionnaireSagas.getStudyQuestionnairesWatcher),
    // fork(QuestionnaireSagas.submitQuestionnaireWatcher),

    // permissions
    // fork(PermissionsSagas.getDeletePermissionWatcher),

    // time use diary
    fork(TimeUseDiarySagas.getTimeUseDiarySubmissionsByDateRangeWatcher),
    fork(TimeUseDiarySagas.submitTimeUseDiaryWatcher),
    // fork(TimeUseDiarySagas.downloadAllTudDataWatcher),
    // fork(TimeUseDiarySagas.downloadDailyTudDataWatcher),

    fork(DashboardSagas.countAllParticipantsWatcher),
    fork(DashboardSagas.countAllStudiesWatcher),
    fork(DashboardSagas.getAllStudiesTableDataWatcher),
    fork(DashboardSagas.getOrgStudiesTableDataWatcher),
    fork(DashboardSagas.getOrgStudiesWatcher),
    fork(DashboardSagas.getStudyParticipantsCountWatcher),
    fork(DashboardSagas.getSummaryStatsWatcher),
  ]);
}
