/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';

import * as DataSagas from './data/DataSagas';

import * as AppSagas from '../../containers/app/sagas';
import * as AuthSagas from '../auth/sagas';
import * as DashboardSagas from '../../containers/dashboard/sagas';
import * as EDMSagas from '../edm/EDMSagas';
import * as PermissionsSagas from '../permissions/PermissionsSagas';
import * as QuestionnaireSagas from '../../containers/questionnaire/QuestionnaireSagas';
import * as RoutingSagas from '../router/RoutingSagas';
import * as StudySagas from '../../containers/studies/sagas';
import * as SurveySagas from '../../containers/survey/SurveySagas';
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
    // fork(AppSagas.getAppSettingsWatcher),
    // fork(AppSagas.getConfigsWatcher),
    fork(AppSagas.getStudySettingsWatcher),
    fork(AppSagas.getConfigsWatcher),

    // DataSagas
    fork(DataSagas.submitDataGraphWatcher),
    fork(DataSagas.submitPartialReplaceWatcher),

    // EDMSagas
    fork(EDMSagas.getEntityDataModelTypesWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),

    // studies sagas
    fork(StudySagas.createStudyWatcher),
    // fork(StudiesSagas.addStudyParticipantWatcher),
    // fork(StudiesSagas.changeEnrollmentStatusWatcher),
    // fork(StudiesSagas.createStudyWatcher),
    // fork(StudiesSagas.deleteStudyWatcher),
    // fork(StudiesSagas.deleteStudyParticipantWatcher),
    // fork(StudiesSagas.getStudiesWatcher),
    // fork(StudiesSagas.getStudyParticipantsWatcher),
    // fork(StudiesSagas.updateStudyWatcher),

    // apps usage survey
    fork(SurveySagas.getAppUsageSurveyDataWatcher),
    fork(SurveySagas.submitSurveyWatcher),

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
    fork(PermissionsSagas.getDeletePermissionWatcher),

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
