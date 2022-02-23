// @flow

import { forwardRef } from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';

import { dataSchema, uiSchema } from './AddParticipantSchema';

import {
  PAGE_1_SECTION_1,
  PARTICIPANT_ID,
  STUDY_ID,
} from '../../../common/constants';
import { registerParticipant } from '../actions';
import { validateAddParticipantForm } from '../utils';
import type { Study } from '../../../common/types';

const AddParticipantForm = ({
  participants,
  study,
} :{
  participants :Map;
  study :Study;
}, ref) => {

  const dispatch = useDispatch();

  const handleSubmit = ({ formData } :Object) => {
    dispatch(
      registerParticipant({
        [PARTICIPANT_ID]: formData[PAGE_1_SECTION_1][PARTICIPANT_ID],
        [STUDY_ID]: study.id,
      })
    );
  };

  const validate = (formData, errors) => (
    validateAddParticipantForm(formData, errors, participants)
  );

  return (
    <Form
        hideSubmit
        onSubmit={handleSubmit}
        ref={ref}
        noPadding
        schema={dataSchema}
        uiSchema={uiSchema}
        validate={validate} />
  );
};

// $FlowFixMe
export default forwardRef(AddParticipantForm);
