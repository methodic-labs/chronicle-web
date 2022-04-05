/*
 * @flow
 */

import { forwardRef, memo } from 'react';

import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';

import { createSchema, createUiSchema } from './CreateStudySchemas';

import { createStudy } from '../actions';
import { createFormDataFromStudyEntity } from '../utils';
import type { Study } from '../../../common/types';

const CreateStudyForm = ({
  study,
} :{
  study ?:Study;
}, ref) => {

  const dispatch = useDispatch();

  const schema = createSchema();
  const uiSchema = createUiSchema();

  const initialFormData = study ? createFormDataFromStudyEntity(schema, study) : {};

  const handleSubmit = ({ formData } :Object) => {
    if (study) {
      // throw Error('update study not implemented');
      // dispatch(updateStudy({ formData, initialFormData, study }));
    }
    else {
      dispatch(createStudy(formData.page1section1));
    }
  };

  return (
    <Form
        hideSubmit
        formData={initialFormData}
        noPadding
        onSubmit={handleSubmit}
        ref={ref}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

CreateStudyForm.defaultProps = {
  study: undefined
};

// $FlowFixMe
export default memo(
  forwardRef(CreateStudyForm)
);
