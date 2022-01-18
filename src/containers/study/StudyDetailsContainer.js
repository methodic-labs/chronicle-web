/*
 * @flow
 */

import { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map, Set } from 'immutable';
import { Constants } from 'lattice';
import {
  // $FlowFixMe
  Box,
  Colors,
  Spinner,
  StyleUtils,
} from 'lattice-ui-kit';
import { DataUtils, ReduxUtils, useRequestState } from 'lattice-utils';
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

import QuestionnairesContainer from '../questionnaires/QuestionnairesContainer';
import TimeUseDiaryDashboard from '../tud/TimeUseDiaryDashboard';
import * as AppModules from '../../utils/constants/AppModules';
import * as Routes from '../../core/router/Routes';
import { PROPERTY_TYPE_FQNS } from '../../core/edm/constants/FullyQualifiedNames';
import { getIdFromMatch } from '../../core/router/RouterUtils';
import { goToRoot } from '../../core/router/RoutingActions';
import {
  APP_REDUX_CONSTANTS,
  PERMISSIONS_REDUX_CONSTANTS,
  STUDIES_REDUX_CONSTANTS
} from '../../utils/constants/ReduxConstants';
import {
  GET_STUDY_PARTICIPANTS,
  getStudyParticipants,
} from '../studies/StudiesActions';

const { isPending } = ReduxUtils;

const { OPENLATTICE_ID_FQN } = Constants;

const { FULL_NAME_FQN } = PROPERTY_TYPE_FQNS;

const {
  APP_MODULES_ORG_LIST_MAP,
  SELECTED_ORG_ID
} = APP_REDUX_CONSTANTS;

const {
  NOTIFICATIONS_ENABLED_STUDIES,
  PARTICIPANTS,
  STUDIES,
  TIME_USE_DIARY_STUDIES,
} = STUDIES_REDUX_CONSTANTS;

const { HAS_DELETE_PERMISSION } = PERMISSIONS_REDUX_CONSTANTS;

const { NEUTRAL, PURPLE } = Colors;

const { getEntityKeyId } = DataUtils;

const { media } = StyleUtils;

const TabLink = styled(NavLink)`
  border-bottom: 2px solid transparent;
  color: ${NEUTRAL.N600};
  font-size: 18px;
  font-weight: 500;
  line-height: 70px;
  margin-right: 40px;
  outline: none;
  text-decoration: none;

  :focus {
    text-decoration: none;
  }

  :hover {
    color: ${NEUTRAL.N800};
    cursor: pointer;
  }

  &.last-child {
    margin-right: 0;
  }

  &.active {
    border-bottom: 2px solid ${PURPLE.P300};
    color: ${PURPLE.P300};
  }

  ${media.phone`
    line-height: 2;
    font-size:  16px;
  `}
`;

const StudyDetailsContainer = () => {
  const dispatch = useDispatch();

  const match :Match = useRouteMatch();
  const studyId :UUID = getIdFromMatch(match) || '';

  const study = useSelector((state) => state.getIn([STUDIES, STUDIES, studyId], Map()));
  const notificationsEnabledStudies = useSelector(
    (state) => state.getIn([STUDIES, NOTIFICATIONS_ENABLED_STUDIES], Set())
  );
  const questionnaireModuleOrgs = useSelector(
    (state) => state.getIn(['app', APP_MODULES_ORG_LIST_MAP, AppModules.QUESTIONNAIRES], List())
  );

  const selectedOrgId = useSelector((state) => state.getIn(['app', SELECTED_ORG_ID]));

  const notificationsEnabled :boolean = notificationsEnabledStudies.has(studyId);

  const hasDeletePermission :Boolean = useSelector((state) => state.getIn(['permissions', HAS_DELETE_PERMISSION]));

  const timeUseDiaryStudies = useSelector((state) => state.getIn([STUDIES, TIME_USE_DIARY_STUDIES], Set()));

  const studyEKID = getEntityKeyId(study);
  const hasTimeUseDiary = timeUseDiaryStudies.has(studyEKID);

  const participants :Map = useSelector((state) => state.getIn([STUDIES, PARTICIPANTS, studyId], Map()));

  const getParticipantsRS :?RequestState = useRequestState([STUDIES, GET_STUDY_PARTICIPANTS]);

  useEffect(() => {
    // This is useful for avoiding a network request if
    // a cached value is already available.
    if (participants.isEmpty()) {
      dispatch(getStudyParticipants({
        studyEKID: study.getIn([OPENLATTICE_ID_FQN, 0]),
        studyId
      }));
    }
  }, [dispatch, participants, study, studyId]);

  if (study.isEmpty()) {
    dispatch(goToRoot());
  }

  if (isPending(getParticipantsRS)) {
    return (
      <Spinner size="2x" />
    );
  }

  return (
    <>
      <Box fontSize={28} fontWeight="fontWeightNormal">
        { study.getIn([FULL_NAME_FQN, 0]) }
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
              <StudyParticipants
                  hasDeletePermission={hasDeletePermission}
                  participants={participants}
                  study={study} />
            )} />
        <Route
            path={Routes.QUESTIONNAIRES}
            render={() => <QuestionnairesContainer study={study} />} />
        <Route
            path={Routes.TUD_DASHBOARD}
            render={() => (
              <TimeUseDiaryDashboard
                  participants={participants}
                  studyEKID={studyEKID}
                  studyId={studyId} />
            )} />
        <Route
            path={Routes.STUDY}
            render={() => (
              <StudyDetails
                  hasDeletePermission={hasDeletePermission}
                  study={study}
                  notificationsEnabled={notificationsEnabled} />
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
