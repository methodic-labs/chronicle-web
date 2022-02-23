/*
 * @flow
 */

import { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map, Set } from 'immutable';
import {
  Box,
  Colors,
  Spinner,
  StyleUtils,
} from 'lattice-ui-kit';
import { ReduxUtils, useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import type { Match } from 'react-router-dom';
import type { RequestState } from 'redux-reqseq';

import StudyDetails from './StudyDetails';
import StudyParticipants from './StudyParticipants';
import { INITIALIZE_STUDY, initializeStudy } from './actions';

import QuestionnairesContainer from '../questionnaires/QuestionnairesContainer';
import TimeUseDiaryDashboard from '../tud/TimeUseDiaryDashboard';
import * as AppModules from '../../utils/constants/AppModules';
import * as Routes from '../../core/router/Routes';
import { resetRequestStates } from '../../core/redux/actions';
import { selectStudy } from '../../core/redux/selectors';
import { getIdFromMatch } from '../../core/router/RouterUtils';
import { goToRoot } from '../../core/router/RoutingActions';
import {
  APP_REDUX_CONSTANTS,
  STUDIES_REDUX_CONSTANTS
} from '../../utils/constants/ReduxConstants';
import {
  GET_STUDY_PARTICIPANTS,
  getStudyParticipants,
} from '../studies/StudiesActions';
import type { Study } from '../../common/types';

const { isPending } = ReduxUtils;

const {
  APP_MODULES_ORG_LIST_MAP,
  SELECTED_ORG_ID
} = APP_REDUX_CONSTANTS;

const {
  PARTICIPANTS,
  STUDIES,
  TIME_USE_DIARY_STUDIES,
} = STUDIES_REDUX_CONSTANTS;

const StudyDetailsContainer = () => {
  const dispatch = useDispatch();

  const match :Match = useRouteMatch();
  const studyId :UUID = getIdFromMatch(match) || '';

  const study :?Study = useSelector(selectStudy(studyId));

  const questionnaireModuleOrgs = useSelector(
    (state) => state.getIn(['app', APP_MODULES_ORG_LIST_MAP, AppModules.QUESTIONNAIRES], List())
  );

  const selectedOrgId = useSelector((state) => state.getIn(['app', SELECTED_ORG_ID]));

  const timeUseDiaryStudies = useSelector((state) => state.getIn([STUDIES, TIME_USE_DIARY_STUDIES], Set()));

  const hasTimeUseDiary = timeUseDiaryStudies.has(studyId);

  const participants :Map = useSelector((state) => state.getIn([STUDIES, PARTICIPANTS, studyId], Map()));

  const getParticipantsRS :?RequestState = useRequestState([STUDIES, GET_STUDY_PARTICIPANTS]);

  useEffect(() => {
    dispatch(resetRequestStates([INITIALIZE_STUDY]));
    dispatch(initializeStudy(studyId));
    return () => {
      dispatch(resetRequestStates([INITIALIZE_STUDY]));
    };
  }, [dispatch, studyId]);

  useEffect(() => {
    // This is useful for avoiding a network request if
    // a cached value is already available.
    if (participants.isEmpty()) {
      dispatch(getStudyParticipants(studyId));
    }
  }, [dispatch, participants, study, studyId]);

  if (!study) {
    dispatch(goToRoot());
    return null;
  }

  if (isPending(getParticipantsRS)) {
    return (
      <Spinner size="2x" />
    );
  }

  return (
    <>
      <Box fontSize={28} fontWeight="fontWeightNormal">
        { study.title }
      </Box>
      <Box display="flex" mt="30px" mb="50px" overflow="scroll">
        <TabLink exact to={Routes.STUDY.replace(Routes.ID_PARAM, studyId)}>
          Study Details
        </TabLink>
        <TabLink exact to={Routes.PARTICIPANTS.replace(Routes.ID_PARAM, studyId)}>
          Participants
        </TabLink>
        {
          questionnaireModuleOrgs.includes(selectedOrgId) && (
            <TabLink exact to={Routes.QUESTIONNAIRES.replace(Routes.ID_PARAM, studyId)}>
              Questionnaires
            </TabLink>
          )
        }
        {
          hasTimeUseDiary && (
            <TabLink exact to={Routes.TUD_DASHBOARD.replace(Routes.ID_PARAM, studyId)}>
              Time Use Diary
            </TabLink>
          )
        }
      </Box>
      <Switch>
        <Route
            exact
            path={Routes.PARTICIPANTS}
            render={() => (
              <StudyParticipants participants={participants} study={study} />
            )} />
        <Route
            path={Routes.QUESTIONNAIRES}
            render={() => <QuestionnairesContainer study={study} />} />
        <Route
            path={Routes.TUD_DASHBOARD}
            render={() => (
              <TimeUseDiaryDashboard participants={participants} studyId={studyId} />
            )} />
        <Route
            path={Routes.STUDY}
            render={() => (
              <StudyDetails study={study} />
            )} />
        {
          questionnaireModuleOrgs.includes(selectedOrgId) && (
            <Route
                path={Routes.QUESTIONNAIRES}
                render={() => <QuestionnairesContainer study={study} />} />
          )
        }
        <Route render={() => <Redirect to={Routes.STUDY} />} />

      </Switch>
    </>
  );
};

// $FlowFixMe
export default StudyDetailsContainer;
