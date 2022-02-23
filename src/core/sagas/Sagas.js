/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';

import * as DataSagas from './data/DataSagas';

import * as AppSagas from '../../containers/app/sagas';
import * as AuthSagas from '../auth/sagas';
import * as DashboardSagas from '../../containers/dashboard/sagas';
import * as EDMSagas from '../edm/EDMSagas';
// import * as PermissionsSagas from '../permissions/sagas';
import * as QuestionnaireSagas from '../../containers/questionnaire/QuestionnaireSagas';
import * as RoutingSagas from '../router/RoutingSagas';
import * as StudySagas from '../../containers/study/sagas';
import * as SurveySagas from '../../containers/survey/sagas';
import * as TimeUseDiarySagas from '../../containers/tud/TimeUseDiarySagas';

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
    fork(DataSagas.submitDataGraphWatcher),
    fork(DataSagas.submitPartialReplaceWatcher),

    // EDMSagas
    fork(EDMSagas.getEntityDataModelTypesWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),

    // StudiesSagas
    fork(StudySagas.createStudyWatcher),
    fork(StudySagas.getAllStudiesWatcher),
    fork(StudySagas.getStudyParticipantsWatcher),
    fork(StudySagas.getStudySettingsWatcher),
    fork(StudySagas.initializeStudyWatcher),
    fork(StudySagas.registerParticipantWatcher),
    // fork(StudiesSagas.addStudyParticipantWatcher),
    // fork(StudiesSagas.changeEnrollmentStatusWatcher),
    // fork(StudiesSagas.createStudyWatcher),
    // fork(StudiesSagas.deleteStudyWatcher),
    // fork(StudiesSagas.deleteStudyParticipantWatcher),
    // fork(StudiesSagas.getStudiesWatcher),
    // fork(StudiesSagas.updateStudyWatcher),

    // apps usage survey
    fork(SurveySagas.getAppUsageSurveyDataWatcher),
    fork(SurveySagas.submitAppUsageSurveyWatcher),

    // questionnaire
    fork(QuestionnaireSagas.changeActiveStatusWatcher),
    fork(QuestionnaireSagas.createQuestionnaireWatcher),
    fork(QuestionnaireSagas.deleteQuestionnaireWatcher),
    fork(QuestionnaireSagas.downloadQuestionnaireResponsesWatcher),
    fork(QuestionnaireSagas.getQuestionnaireResponsesWatcher),
    fork(QuestionnaireSagas.getQuestionnaireWatcher),
    fork(QuestionnaireSagas.getStudyQuestionnairesWatcher),
    fork(QuestionnaireSagas.submitQuestionnaireWatcher),

    // permissions
    // fork(PermissionsSagas.getDeletePermissionWatcher),

    // time use diary
    fork(TimeUseDiarySagas.downloadAllTudDataWatcher),
    fork(TimeUseDiarySagas.downloadDailyTudDataWatcher),
    fork(TimeUseDiarySagas.getSubmissionsByDateWatcher),
    fork(TimeUseDiarySagas.submitTudDataWatcher),
    fork(TimeUseDiarySagas.verifyTudLinkWatcher),

    fork(DashboardSagas.countAllParticipantsWatcher),
    fork(DashboardSagas.countAllStudiesWatcher),
    fork(DashboardSagas.getAllStudiesTableDataWatcher),
    fork(DashboardSagas.getOrgStudiesTableDataWatcher),
    fork(DashboardSagas.getOrgStudiesWatcher),
    fork(DashboardSagas.getStudyParticipantsCountWatcher),
    fork(DashboardSagas.getSummaryStatsWatcher),
  ]);
}
