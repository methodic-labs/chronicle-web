import { getIn } from 'immutable';

import { PAGE_1_SECTION_1, PARTICIPANT_ID } from '../../../common/constants';

// custom react-jsonschema-form validation
// ref: https://react-jsonschema-form.readthedocs.io/en/latest/validation/#custom-error-messages
export default function validateAddParticipantForm(formData, errors, participants) {

  const participantId = getIn(formData, [PAGE_1_SECTION_1, PARTICIPANT_ID]);
  const participantIds = participants.valueSeq().map((participant) => participant[PARTICIPANT_ID]);

  if (participantIds.includes(participantId.trim())) {
    errors[PAGE_1_SECTION_1][PARTICIPANT_ID].addError('Participant ID should be unique.');
  }

  return errors;
}
