// @flow

import { useRef } from 'react';

import { Map } from 'immutable';
import { ActionModal } from 'lattice-ui-kit';
import { useRequestState } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import AddParticipantForm from './AddParticipantForm';

import { STUDIES } from '../../../common/constants';
import { REGISTER_PARTICIPANT } from '../actions';
import type { Study } from '../../../common/types';

const AddParticipantModal = ({
  isVisible,
  onCloseModal,
  participants,
  study,
} :{
  isVisible :boolean;
  onCloseModal :() => void;
  participants :Map;
  study :Study;
}) => {

  const formRef = useRef();

  const addParticipantRS :?RequestState = useRequestState([STUDIES, REGISTER_PARTICIPANT]);

  const requestStateComponents = {
    [RequestStates.STANDBY]: (
      <div>
        <AddParticipantForm participants={participants} ref={formRef} study={study} />
      </div>
    ),
    [RequestStates.FAILURE]: (
      <div>
        <span> Failed to add participant. Please try again. </span>
      </div>
    ),
    [RequestStates.SUCCESS]: (
      <div>
        <span> Successfully added participant.</span>
      </div>
    )
  };

  const handleOnSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <ActionModal
        isVisible={isVisible}
        onClickPrimary={handleOnSubmit}
        onClose={onCloseModal}
        requestState={addParticipantRS}
        requestStateComponents={requestStateComponents}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary="Submit"
        textSecondary="Cancel"
        textTitle="Add Participant" />
  );
};

export default AddParticipantModal;
