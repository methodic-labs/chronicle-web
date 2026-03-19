import { useRef } from 'react';
import { RequestStates } from 'redux-reqseq';

import CreateStudyForm from './CreateStudyForm';

import { STUDIES } from '../../../common/constants';
import { useRequestState } from '../../../common/utils';
import { ActionModal } from '../../../lattice-ui-kit';
import { CREATE_STUDY, UPDATE_STUDY } from '../actions';

const StudyDetailsModal = ({
  handleOnCloseModal,
  isVisible,
  study,
}) => {

  const formRef = useRef();

  const createStudyRS = useRequestState([STUDIES, CREATE_STUDY]);
  const updateStudyRS = useRequestState([STUDIES, UPDATE_STUDY]);

  const handleOnSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const requestStateComponents = {
    [RequestStates.STANDBY]: (
      <div>
        <CreateStudyForm ref={formRef} study={study} />
      </div>
    ),
    [RequestStates.FAILURE]: (
      <div>
        {
          study
            ? <span> Failed to update study. Please try again. </span>
            : <span> Failed to create a new study. Please try again. </span>
        }
      </div>
    ),
    [RequestStates.SUCCESS]: (
      <div>
        {
          study
            ? <span> Successfully updated study. </span>
            : <span> Successfully created a new study. </span>
        }
      </div>
    )
  };

  const textTitle = study ? 'Edit Study ' : 'Create Study';
  const textPrimary = study ? 'Save Changes' : 'Submit';
  const requestState = study ? updateStudyRS : createStudyRS;

  return (
    <ActionModal
        isVisible={isVisible}
        onClose={handleOnCloseModal}
        requestState={requestState}
        requestStateComponents={requestStateComponents}
        onClickPrimary={handleOnSubmit}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary={textPrimary}
        textSecondary="Cancel"
        textTitle={textTitle} />
  );
};

StudyDetailsModal.defaultProps = {
  study: undefined
};

export default StudyDetailsModal;
