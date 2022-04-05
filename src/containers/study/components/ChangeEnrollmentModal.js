// @flow

import { useEffect, useState } from 'react';

import { ActionModal, Colors } from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { ParticipationStatuses } from '../../../common/constants';
import type { ParticipationStatus } from '../../../common/types';

const {
  ENROLLED,
  NOT_ENROLLED,
} = ParticipationStatuses;
const { NEUTRAL } = Colors;

type Props = {
  enrollmentStatus :string;
  handleOnChangeEnrollment :(status :ParticipationStatus) => void;
  handleOnClose :() => void;
  isVisible :boolean;
  participantId :UUID;
  requestState :?RequestState;
}

const ChangeEnrollment = ({
  enrollmentStatus,
  handleOnChangeEnrollment,
  handleOnClose,
  isVisible,
  participantId,
  requestState
} :Props) => {

  const [action, setAction] = useState('pause');

  useEffect(() => {
    setAction(enrollmentStatus === ENROLLED ? 'pause' : 'resume');
  }, [isVisible]);

  const completedAction = enrollmentStatus === ENROLLED ? 'resumed' : 'paused';

  const handleOnConfirm = () => {
    const newStatus = enrollmentStatus === ENROLLED ? NOT_ENROLLED : ENROLLED;
    handleOnChangeEnrollment(newStatus);
  };

  const requestStateComponents = {
    [RequestStates.STANDBY]: (
      <div>
        <span> Are you sure you want to </span>
        { action }
        <span> collecting data on </span>
        <span style={{ color: NEUTRAL.N900, fontWeight: 500 }}>
          { participantId }
        </span>
        <span>?</span>
      </div>
    ),
    [RequestStates.SUCCESS]: (
      <div>
        <span> Successfully </span>
        { completedAction }
        <span> collecting data on participant. </span>
      </div>
    ),
    [RequestStates.FAILURE]: (
      <div>
        <span> Failed to </span>
        { action}
        <span> collecting data on participant. Please try again. </span>
      </div>
    )
  };

  const title = `${action.charAt(0).toUpperCase()}${action.substr(1)} Enrollment`;
  return (
    <ActionModal
        isVisible={isVisible}
        onClickPrimary={handleOnConfirm}
        onClose={handleOnClose}
        requestState={requestState}
        requestStateComponents={requestStateComponents}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary="Yes"
        textSecondary="No"
        textTitle={title} />
  );
};

export default ChangeEnrollment;
