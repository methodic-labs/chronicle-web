/*
 * @flow
 */

import { forwardRef, memo } from 'react';

import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';

import { createSchema, createUiSchema } from './CreateStudySchemas';

import { FEATURES, ID, STUDY } from '../../../common/constants';
import { createStudy, updateStudy } from '../actions';
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

  const getStudyFeatures = (features :[]) => {
    const result = features.reduce((obj, feature) => ({
      ...obj,
      [feature]: study?.modules[feature] ?? {}
    }), {});
    return result;
  };

  const handleSubmit = ({ formData } :Object) => {
    if (study) {
      const { features, ...rest } = formData.page1section1;

      const updated = {
        ...initialFormData?.page1section1,
        ...rest,
        modules: getStudyFeatures(features)
      };
      delete updated[FEATURES];
      dispatch(updateStudy({ [STUDY]: updated, [ID]: study.id }));
    }
    else {
      const { features, ...rest } = formData.page1section1;
      const studyDetails = {
        modules: getStudyFeatures(features),
        ...rest
      };
      dispatch(createStudy(studyDetails));
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
