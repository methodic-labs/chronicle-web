/*
 * @flow
 */

import { memo, forwardRef } from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';

import { createSchema, createUiSchema } from './CreateStudySchemas';

import { createFormDataFromStudyEntity } from '../../../utils/FormUtils';
import { createStudy, updateStudy } from '../StudiesActions';

type Props = {
  notificationsEnabled :boolean;
  study :Map;
}
const CreateStudyForm = (props:Props, ref) => {
  const { notificationsEnabled, study } = props;

  const dispatch = useDispatch();

  const schema = createSchema();
  const uiSchema = createUiSchema();

  const initialFormData = study ? createFormDataFromStudyEntity(schema, notificationsEnabled, study) : {};

  const handleSubmit = ({ formData } :Object) => {
    if (study) {
      dispatch(updateStudy({ formData, initialFormData, study }));
    }
    else {
      dispatch(createStudy({ formData }));
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

// $FlowFixMe
export default memo<Props, typeof Form>(
  forwardRef(CreateStudyForm)
);
