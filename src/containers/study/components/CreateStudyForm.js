import { forwardRef, memo } from 'react';
import { useDispatch } from 'react-redux';

import { FEATURES, ID, STUDY } from '../../../common/constants';
import { Form } from '../../../lattice-fabricate';
import { createStudy, updateStudy } from '../actions';
import { createFormDataFromStudyEntity } from '../utils';
import { createSchema, createUiSchema } from './CreateStudySchemas';

const CreateStudyForm = ({
  study,
}, ref) => {

  const dispatch = useDispatch();

  const schema = createSchema();
  const uiSchema = createUiSchema();

  const initialFormData = study ? createFormDataFromStudyEntity(schema, study) : {};

  const getStudyFeatures = (features) => {
    const result = features.reduce((obj, feature) => ({
      ...obj,
      [feature]: study?.modules[feature] ?? {}
    }), {});
    return result;
  };

  const handleSubmit = ({ formData }) => {
    if (study) {
      const { features, ...rest } = formData.page1section1;

      const updated = {
        // $FlowIgnore
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

export default memo(
  forwardRef(CreateStudyForm)
);
