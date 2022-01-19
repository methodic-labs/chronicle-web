/*
 * @flow
 */

import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  Colors,
  Modal,
  ModalFooter,
  Spinner,
  Typography
} from 'lattice-ui-kit';
import {
  DataUtils,
  ReduxConstants,
  ReduxUtils,
  useStepState
} from 'lattice-utils';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import EnterContactInformationForm from './EnterContactInformationForm';
import ParticipantSelectionTable from './ParticipantSelectionTable';

import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';
import { currentOrgIdSelector } from '../../app/AppSelectors';
import { getParticipantLoginLink } from '../../study/utils';
import { SEND_MESSAGE, sendMessage } from '../actions';

const { NEUTRAL } = Colors;
const { getPropertyValue } = DataUtils;
const { REQUEST_STATE } = ReduxConstants;
const { STUDY_ID } = PROPERTY_TYPE_FQNS;
const {
  isPending,
  isSuccess,
  isFailure
} = ReduxUtils;

const ModalBody = styled.div`
  width: 500px;
`;

const MessageBody = styled(Card)`
  padding: 30px;
  background-color: ${NEUTRAL.N50};
`;

const SendMessagesModal = ({
  isVisible,
  onClose,
  participants,
  study,
} :{
  isVisible :boolean;
  onClose :() => void;
  participants :Map<UUID, Map>;
  study :Map;
  onClose :() => void;
}) => {
  const dispatch = useDispatch();
  const [step, stepBack, stepNext, setStep] = useStepState(5);
  const [targetParticipants, setTargetParticipants] = useState(Map());
  const organizationId :UUID = useSelector(currentOrgIdSelector);
  const studyId = getPropertyValue(study, [STUDY_ID, 0], '');

  const sendMessageRS :RequestState = useSelector(
    (state) => state.getIn(['message', SEND_MESSAGE, REQUEST_STATE])
  );

  const messagePending = isPending(sendMessageRS);
  const messageSuccess = isSuccess(sendMessageRS);
  const messageFailure = isFailure(sendMessageRS);

  useEffect(() => {
    if (!isVisible) {
      setStep(0);
      setTargetParticipants(Map());
    }
    if (messagePending) {
      setStep(3);
    }
  }, [isVisible, messagePending, setStep]);

  const onSubmit = () => {
    const messageDetailsList = targetParticipants.entrySeq().map(([id, contact]) => {
      const phoneNumber = contact.get('phone');
      const participantLoginLink = getParticipantLoginLink(organizationId, studyId, id);
      return {
        participantId: id,
        phoneNumber,
        studyId,
        messageType: 'ENROLLMENT',
        dateTime: DateTime.local().toISO(),
        url: participantLoginLink
      };
    }).toJS();
    dispatch(sendMessage({ messageDetailsList, organizationId }));
  };

  const contactIsEmptyOrError = targetParticipants.valueSeq()
    .some((contact) => (!contact.get('phone', '').length || contact.get('error', false)));

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        textTitle="Send SMS Message with Enrollment Link">
      {
        step === 0 && (
          <>
            <ModalBody>
              <Typography gutterBottom>Select Participants</Typography>
              <ParticipantSelectionTable
                  handleOnSelect={setTargetParticipants}
                  participants={participants}
                  targetParticipants={targetParticipants} />
            </ModalBody>
            <ModalFooter
                isDisabledPrimary={targetParticipants.isEmpty()}
                onClickPrimary={stepNext}
                textPrimary="Next: Enter Contact Information for Participants" />
          </>
        )
      }
      {
        step === 1 && (
          <>
            <ModalBody>
              <Typography gutterBottom>Enter Contact Information</Typography>
              <EnterContactInformationForm
                  targetParticipants={targetParticipants}
                  setTargetParticipants={setTargetParticipants} />
            </ModalBody>
            <ModalFooter
                isDisabledPrimary={contactIsEmptyOrError}
                onClickPrimary={stepNext}
                onClickSecondary={stepBack}
                textPrimary="Next: Confirm"
                textSecondary="Back" />
          </>
        )
      }
      {
        step === 2 && (
          <>
            <ModalBody>
              <Typography gutterBottom>Send Message</Typography>
              <Typography variant="subtitle1" gutterBottom>
                The following message will be sent to the selected partipant(s):
              </Typography>
              <MessageBody>
                <Typography variant="caption">
                  {
                    'Chronicle device enrollment:  Please download app from your app store and click on '
                    + `https://openlattice.com/chronicle/login?organizationId=${organizationId}`
                    + `&studyId=${studyId}&participantId=*`
                  }
                </Typography>
              </MessageBody>
            </ModalBody>
            <ModalFooter
                onClickPrimary={onSubmit}
                onClickSecondary={stepBack}
                textPrimary="Send Messages"
                textSecondary="Back" />
          </>
        )
      }
      {
        step === 3 && (
          <>
            <ModalBody>
              {
                messagePending && (
                  <Spinner size="2x" />
                )
              }
              {
                messageSuccess && (
                  <>
                    <Typography gutterBottom>Success!</Typography>
                    <Typography gutterBottom>Messages were sent succesfully to the selected participants!</Typography>
                  </>
                )
              }
              {
                messageFailure && <Typography gutterBottom>Failed to Send Messages</Typography>
              }
            </ModalBody>
            <ModalFooter
                onClickPrimary={onClose}
                textPrimary="Close" />
          </>
        )
      }
    </Modal>
  );
};

export default SendMessagesModal;
