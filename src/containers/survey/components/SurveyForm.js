import { useEffect, useState } from 'react';

import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import SubmissionFailureModal from './SubmissionFailureModal';

import { resetRequestStates } from '../../../core/redux/actions';
import { SUBMIT_APP_USAGE_SURVEY, submitAppUsageSurvey } from '../actions';
import { createSubmissionData, createSurveyFormSchema } from '../utils';

const SurveyForm = ({
  data,
  participantId,
  studyId,
  submitSurveyRS,
}) => {

  const dispatch = useDispatch();

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const { uiSchema, schema } = createSurveyFormSchema(data);

  useEffect(() => {
    setErrorModalVisible(submitSurveyRS === RequestStates.FAILURE);
  }, [errorModalVisible, setErrorModalVisible, submitSurveyRS]);

  const handleOnSubmit = ({ formData }) => {
    dispatch(submitAppUsageSurvey({
      data: createSubmissionData(formData, data),
      participantId,
      studyId,
    }));
  };

  const hideErrorModal = () => {
    setErrorModalVisible(false);
    dispatch(resetRequestStates([SUBMIT_APP_USAGE_SURVEY]));
  };

  return (
    <>
      <Form
          isSubmitting={submitSurveyRS === RequestStates.PENDING}
          onSubmit={handleOnSubmit}
          schema={schema}
          uiSchema={uiSchema} />
      <SubmissionFailureModal
          handleOnClose={hideErrorModal}
          isVisible={errorModalVisible} />
    </>
  );
};

export default SurveyForm;
