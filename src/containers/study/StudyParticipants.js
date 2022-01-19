/*
 * @flow
 */

import { useEffect, useReducer, useState } from 'react';

import { Map } from 'immutable';
import {
  Box,
  Card,
  CardSegment,
  Grid,
  SearchInput,
} from 'lattice-ui-kit';
import { DataUtils, useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import AddParticipantModal from './components/AddParticipantModal';
import ChangeEnrollmentModal from './components/ChangeEnrollmentModal';
import DeleteParticipantModal from './components/DeleteParticipantModal';
import DownloadParticipantDataModal from './components/DownloadParticipantDataModal';
import ParticipantInfoModal from './components/ParticipantInfoModal';
import ParticipantsActionButton from './components/ParticipantsActionButton';
import ParticipantsTable from './ParticipantsTable';
import ParticipantsTableActions from './constants/ParticipantsTableActions';
import ParticipantsTableDispatch from './components/ParticipantsTableDispatch';
import TudSubmissionHistory from './components/TudSubmissionHistory';
import { COLUMN_FIELDS } from './constants/tableColumns';

import { PROPERTY_TYPE_FQNS } from '../../core/edm/constants/FullyQualifiedNames';
import { resetRequestState } from '../../core/redux/ReduxActions';
import {
  currentOrgIdSelector,
  orgHasDataCollectionModuleSelector,
  orgHasSurveyModuleSelector
} from '../app/AppSelectors';
import {
  ADD_PARTICIPANT,
  CHANGE_ENROLLMENT_STATUS,
  DELETE_STUDY_PARTICIPANT,
  changeEnrollmentStatus,
  deleteStudyParticipant,
} from '../studies/StudiesActions';

const { getEntityKeyId } = DataUtils;

const { PERSON_ID, STUDY_ID } = PROPERTY_TYPE_FQNS;

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

type Props = {
  hasDeletePermission :Boolean;
  participants :Map;
  study :Map;
};

const StudyParticipants = ({ hasDeletePermission, participants, study } :Props) => {
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

  const studyId = study.getIn([STUDY_ID, 0]);
  const studyEntityKeyId = getEntityKeyId(study);

  const [filteredParticipants, setFilteredParticipants] = useState(Map());

  // selectors
  const orgHasSurveyModule = useSelector(orgHasSurveyModuleSelector);
  const orgHasDataCollectionModule = useSelector(orgHasDataCollectionModuleSelector);
  const selectedOrgId :UUID = useSelector(currentOrgIdSelector);

  const changeEnrollmentStatusRS :?RequestState = useRequestState(['studies', CHANGE_ENROLLMENT_STATUS]);
  const deleteParticipantRS :?RequestState = useRequestState(['studies', DELETE_STUDY_PARTICIPANT]);

  useEffect(() => {
    setFilteredParticipants(participants);
  }, [participants]);

  // console.log(isEnrollmentModalOpen)
  useEffect(() => {
    storeDispatch(resetRequestState(CHANGE_ENROLLMENT_STATUS));
  }, [isEnrollmentModalOpen, storeDispatch]);

  useEffect(() => {
    storeDispatch(resetRequestState(DELETE_STUDY_PARTICIPANT));
  }, [isDeleteModalOpen, storeDispatch]);

  useEffect(() => {
    storeDispatch(resetRequestState(ADD_PARTICIPANT));
  }, [isAddParticipantModalOpen, storeDispatch]);

  const handleOnChange = (event :SyntheticInputEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    const { value } = currentTarget;

    const matchingResults = participants
      .filter((participant) => participant.getIn([PERSON_ID, 0]).toLowerCase().includes(value.toLowerCase()));
    setFilteredParticipants(matchingResults);
  };

  const handleOnDeleteParticipant = () => {
    storeDispatch(deleteStudyParticipant({
      participantEntityKeyId,
      participantId: participants.getIn([participantEntityKeyId, PERSON_ID, 0]),
      studyId,
    }));
  };

  const handleOnChangeEnrollment = () => {
    storeDispatch(changeEnrollmentStatus({
      enrollmentStatus: participants.getIn([participantEntityKeyId, ENROLLMENT_STATUS, 0]),
      participantEntityKeyId,
      studyId,
    }));
  };

  return (
    <ParticipantsTableDispatch.Provider value={dispatch}>
      <Card>
        <CardSegment vertical>
          <Grid container spacing={2}>
            <Grid item xs={11}>
              <SearchInput placeholder="Filter participants" onChange={handleOnChange} />
            </Grid>
            <Grid item alignItems="center" xs={1}>
              <ParticipantsActionButton study={study} participants={participants} />
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
                  hasDeletePermission={hasDeletePermission}
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
                  studyId={studyId} />
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
          participantEntityKeyId && studyEntityKeyId && (
            <DownloadParticipantDataModal
                handleOnClose={() => dispatch({ type: TOGGLE_DOWNLOAD_MODAL, isModalOpen: false })}
                isVisible={isDownloadModalOpen}
                participantEntityKeyId={participantEntityKeyId}
                participantId={participants.getIn([participantEntityKeyId, PERSON_ID, 0])}
                selectedOrgId={selectedOrgId}
                studyEntityKeyId={studyEntityKeyId}
                studyId={studyId} />
          )
        }
      </Card>
    </ParticipantsTableDispatch.Provider>
  );
};

export default StudyParticipants;
