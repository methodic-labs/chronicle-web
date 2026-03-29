import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  PAGE_1_SECTION_1,
  PARTICIPANT_ID,
  STUDY_ID,
} from '../../../common/constants';
import { Form } from '../../../lattice-fabricate';
import { registerParticipant } from '../actions';
import { validateAddParticipantForm } from '../utils';
import { dataSchema, uiSchema } from './AddParticipantSchema';

const AddParticipantForm = ({
  participants,
  study,
}, ref) => {

  const dispatch = useDispatch();

  const handleSubmit = ({ formData }) => {
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

export default forwardRef(AddParticipantForm);
