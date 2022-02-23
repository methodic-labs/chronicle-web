/*
 * @flow
 */

import { useEffect, useReducer, useState } from 'react';

import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map, Set } from 'immutable';
import {
  Box,
  Button,
  Card,
  CardSegment,
  Grid,
  SearchInput,
} from 'lattice-ui-kit';
import { useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import AddParticipantModal from './components/AddParticipantModal';
import ChangeEnrollmentModal from './components/ChangeEnrollmentModal';
import DeleteParticipantModal from './components/DeleteParticipantModal';
import DownloadParticipantDataModal from './components/DownloadParticipantDataModal';
import ParticipantInfoModal from './components/ParticipantInfoModal';
import ParticipantsTable from './ParticipantsTable';
import ParticipantsTableActions from './constants/ParticipantsTableActions';
import ParticipantsTableDispatch from './components/ParticipantsTableDispatch';
import TudSubmissionHistory from './components/TudSubmissionHistory';
import {
  CHANGE_ENROLLMENT_STATUS,
  DELETE_STUDY_PARTICIPANT,
  REGISTER_PARTICIPANT,
  changeEnrollmentStatus,
  deleteStudyParticipant,
} from './actions';
import { COLUMN_FIELDS } from './constants/tableColumns';

import { PARTICIPANT_ID, STUDY_ID } from '../../common/constants';
import { PROPERTY_TYPE_FQNS } from '../../core/edm/constants/FullyQualifiedNames';
import { resetRequestStates } from '../../core/redux/actions';
import { selectMyKeys, selectStudyParticipants } from '../../core/redux/selectors';
import {
  currentOrgIdSelector,
  orgHasDataCollectionModuleSelector,
  orgHasSurveyModuleSelector
} from '../app/AppSelectors';
import type { Participant, Study } from '../../common/types';

const { PERSON_ID } = PROPERTY_TYPE_FQNS;

const { ENROLLMENT_STATUS } = COLUMN_FIELDS;

const {
  SET_PARTICIPANT_EKID,
  TOGGLE_ADD_PARTICIPANT_MODAL,
  TOGGLE_DELETE_MODAL,
  TOGGLE_DOWNLOAD_MODAL,
  TOGGLE_ENROLLMENT_MODAL,
  TOGGLE_INFO_MODAL,
  TOGGLE_TUD_SUBMISSION_HISTORY_MODAL,
} = ParticipantsTableActions;

const AddParticipantsButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: 5px;
`;

const initialState = {
  isAddParticipantModalOpen: false,
  isDeleteModalOpen: false,
  isDownloadModalOpen: false,
  isEnrollmentModalOpen: false,
  isInfoModalOpen: false,
  isTudSubmissionHistoryModalOpen: false,
  participantEntityKeyId: null
};

const reducer = (state :Object, action :Object) => {
  switch (action.type) {
    case TOGGLE_INFO_MODAL:
      return {
        ...state,
        isInfoModalOpen: action.isModalOpen
      };

    case TOGGLE_DELETE_MODAL:
      return {
        ...state,
        isDeleteModalOpen: action.isModalOpen
      };

    case SET_PARTICIPANT_EKID:
      return {
        ...state,
        participantEntityKeyId: action.participantEntityKeyId
      };

    case TOGGLE_ADD_PARTICIPANT_MODAL:
      return {
        ...state,
        isAddParticipantModalOpen: action.isModalOpen
      };

    case TOGGLE_DOWNLOAD_MODAL:
      return {
        ...state,
        isDownloadModalOpen: action.isModalOpen
      };

    case TOGGLE_ENROLLMENT_MODAL:
      return {
        ...state,
        isEnrollmentModalOpen: action.isModalOpen
      };

    case TOGGLE_TUD_SUBMISSION_HISTORY_MODAL:
      return {
        ...state,
        isTudSubmissionHistoryModalOpen: action.isModalOpen
      };

    default:
      return state;
  }
};

const StudyParticipantsContainer = ({
  study,
} :{
  study :Study;
}) => {

  const storeDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isAddParticipantModalOpen,
    isDeleteModalOpen,
    isDownloadModalOpen,
    isEnrollmentModalOpen,
    isInfoModalOpen,
    isTudSubmissionHistoryModalOpen,
    participantEntityKeyId,
  } = state;

  const [filteredParticipants, setFilteredParticipants] = useState(Map());

  // selectors
  const participants :Map = useSelector(selectStudyParticipants(study.id));
  const orgHasSurveyModule = useSelector(orgHasSurveyModuleSelector);
  const orgHasDataCollectionModule = useSelector(orgHasDataCollectionModuleSelector);
  const selectedOrgId :UUID = useSelector(currentOrgIdSelector);

  const myKeys :Set<List<UUID>> = useSelector(selectMyKeys());
  const isOwner :boolean = myKeys.has(List([study.id]));

  const changeEnrollmentStatusRS :?RequestState = useRequestState(['studies', CHANGE_ENROLLMENT_STATUS]);
  const deleteParticipantRS :?RequestState = useRequestState(['studies', DELETE_STUDY_PARTICIPANT]);

  useEffect(() => {
    setFilteredParticipants(participants);
  }, [participants]);

  // console.log(isEnrollmentModalOpen)
  useEffect(() => {
    storeDispatch(resetRequestStates([CHANGE_ENROLLMENT_STATUS]));
  }, [isEnrollmentModalOpen, storeDispatch]);

  useEffect(() => {
    storeDispatch(resetRequestStates([DELETE_STUDY_PARTICIPANT]));
  }, [isDeleteModalOpen, storeDispatch]);

  useEffect(() => {
    storeDispatch(resetRequestStates([REGISTER_PARTICIPANT]));
  }, [isAddParticipantModalOpen, storeDispatch]);

  const handleOnChange = (event :SyntheticInputEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    const { value } = currentTarget;

    const matchingResults = participants
      .filter((participant :Participant) => participant[PARTICIPANT_ID].toLowerCase().includes(value.toLowerCase()));
    setFilteredParticipants(matchingResults);
  };

  const handleOnDeleteParticipant = () => {
    storeDispatch(deleteStudyParticipant({
      participantEntityKeyId,
      participantId: participants.getIn([participantEntityKeyId, PERSON_ID, 0]),
      studyId: study.id,
    }));
  };

  const handleOnChangeEnrollment = () => {
    storeDispatch(changeEnrollmentStatus({
      enrollmentStatus: participants.getIn([participantEntityKeyId, ENROLLMENT_STATUS, 0]),
      participantEntityKeyId,
      studyId: study.id,
    }));
  };

  return (
    <ParticipantsTableDispatch.Provider value={dispatch}>
      <Card>
        <CardSegment vertical>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={9}>
              <SearchInput placeholder="Filter participants" onChange={handleOnChange} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AddParticipantsButton
                  fullWidth
                  onClick={() => dispatch({ type: TOGGLE_ADD_PARTICIPANT_MODAL, isModalOpen: true })}
                  color="primary"
                  startIcon={<FontAwesomeIcon icon={faPlus} />}>
                Add Participant
              </AddParticipantsButton>
            </Grid>
          </Grid>
          {
            !participants.isEmpty()
            && filteredParticipants.isEmpty()
            && <Box mt={3} textAlign="left"> No matching results. </Box>
          }
          {
            participants.isEmpty()
            && <Box mt={3} align="center"> No participants found! </Box>
          }
          {
            !filteredParticipants.isEmpty()
            && (
              <ParticipantsTable
                  hasDeletePermission={isOwner}
                  orgHasDataCollectionModule={orgHasDataCollectionModule}
                  orgHasSurveyModule={orgHasSurveyModule}
                  participants={filteredParticipants} />
            )
          }
        </CardSegment>
        <AddParticipantModal
            isVisible={isAddParticipantModalOpen}
            onCloseModal={() => dispatch({ type: TOGGLE_ADD_PARTICIPANT_MODAL, isModalOpen: false })}
            participants={participants}
            study={study} />
        {
          participantEntityKeyId && (
            <>
              <ParticipantInfoModal
                  handleOnClose={() => dispatch({ type: TOGGLE_INFO_MODAL, isModalOpen: false })}
                  isVisible={isInfoModalOpen}
                  orgId={selectedOrgId}
                  participantId={participants.getIn([participantEntityKeyId, PERSON_ID, 0])}
                  studyId={study.id} />
              <ChangeEnrollmentModal
                  enrollmentStatus={participants.getIn([participantEntityKeyId, ENROLLMENT_STATUS, 0])}
                  handleOnChangeEnrollment={handleOnChangeEnrollment}
                  handleOnClose={() => dispatch({ type: TOGGLE_ENROLLMENT_MODAL, isModalOpen: false })}
                  isVisible={isEnrollmentModalOpen}
                  participantId={participants.getIn([participantEntityKeyId, PERSON_ID, 0])}
                  requestState={changeEnrollmentStatusRS} />
              <DeleteParticipantModal
                  handleOnClose={() => dispatch({ type: TOGGLE_DELETE_MODAL, isModalOpen: false })}
                  handleOnDeleteParticipant={handleOnDeleteParticipant}
                  isVisible={isDeleteModalOpen}
                  participantId={participants.getIn([participantEntityKeyId, PERSON_ID, 0])}
                  requestState={deleteParticipantRS} />
              <TudSubmissionHistory
                  handleOnClose={() => dispatch({ type: TOGGLE_TUD_SUBMISSION_HISTORY_MODAL, isModalOpen: false })}
                  isVisible={isTudSubmissionHistoryModalOpen}
                  participantEntityKeyId={participantEntityKeyId}
                  participantId={participants.getIn([participantEntityKeyId, PERSON_ID, 0])} />
            </>
          )
        }
        {
          participantEntityKeyId && (
            <DownloadParticipantDataModal
                handleOnClose={() => dispatch({ type: TOGGLE_DOWNLOAD_MODAL, isModalOpen: false })}
                isVisible={isDownloadModalOpen}
                participantEntityKeyId={participantEntityKeyId}
                participantId={participants.getIn([participantEntityKeyId, PERSON_ID, 0])}
                selectedOrgId={selectedOrgId}
                studyId={study.id} />
          )
        }
      </Card>
    </ParticipantsTableDispatch.Provider>
  );
};

export default StudyParticipantsContainer;
