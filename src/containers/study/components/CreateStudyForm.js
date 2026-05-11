import { forwardRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CLOCK_FORMAT,
  CLOCK_FORMAT_LOCKED,
  FEATURES,
  ID,
  LANGUAGE,
  STUDY,
  StudySettingTypes,
} from '../../../common/constants';
import { Form } from '../../../lattice-fabricate';
import { selectStudySettings } from '../../../core/redux/selectors';
import { createStudy, updateStudy, updateStudySettings } from '../actions';
import { createFormDataFromStudyEntity } from '../utils';
import { INTERNATIONALIZATION, createSchema, createUiSchema } from './CreateStudySchemas';

const TUD_SETTINGS_CLASS = 'com.openlattice.chronicle.timeusediary.TimeUseDiarySettings';

const readTudSettings = (settingsMap) => {
  const tud = settingsMap.get(StudySettingTypes.TIME_USE_DIARY);
  return tud ? tud.toJS() : {};
};

const buildI18nFormData = (tud) => ({
  [LANGUAGE]: tud.language ?? 'en',
  [CLOCK_FORMAT]: tud.clockFormat ?? 12,
  [CLOCK_FORMAT_LOCKED]: tud.clockFormatLocked ?? false,
});

const i18nEquals = (a, b) => (
  a[LANGUAGE] === b[LANGUAGE]
  && a[CLOCK_FORMAT] === b[CLOCK_FORMAT]
  && a[CLOCK_FORMAT_LOCKED] === b[CLOCK_FORMAT_LOCKED]
);

const CreateStudyForm = ({
  study,
}, ref) => {

  const dispatch = useDispatch();
  const isEdit = Boolean(study);

  const studySettings = useSelector(selectStudySettings(study?.id));
  const tudSettings = readTudSettings(studySettings);
  const initialI18n = buildI18nFormData(tudSettings);

  const schema = createSchema(isEdit);
  const uiSchema = createUiSchema(isEdit);

  const initialFormData = study ? createFormDataFromStudyEntity(schema, study) : {};
  if (isEdit) {
    initialFormData.page1section1 = initialFormData.page1section1 || {};
    initialFormData.page1section1[INTERNATIONALIZATION] = initialI18n;
  }

  const getStudyFeatures = (features) => {
    const result = features.reduce((obj, feature) => ({
      ...obj,
      [feature]: study?.modules[feature] ?? {}
    }), {});
    return result;
  };

  const handleSubmit = ({ formData }) => {
    if (study) {
      const {
        features,
        [INTERNATIONALIZATION]: i18n,
        ...rest
      } = formData.page1section1;

      const updated = {
        ...initialFormData?.page1section1,
        ...rest,
        modules: getStudyFeatures(features)
      };
      delete updated[FEATURES];
      delete updated[INTERNATIONALIZATION];

      dispatch(updateStudy({ [STUDY]: updated, [ID]: study.id }));

      if (i18n && !i18nEquals(i18n, initialI18n)) {
        const settings = {
          '@class': tudSettings['@class'] || TUD_SETTINGS_CLASS,
          ...tudSettings,
          [LANGUAGE]: i18n[LANGUAGE],
          [CLOCK_FORMAT]: i18n[CLOCK_FORMAT],
          [CLOCK_FORMAT_LOCKED]: i18n[CLOCK_FORMAT_LOCKED],
        };
        dispatch(updateStudySettings({
          studyId: study.id,
          settingType: StudySettingTypes.TIME_USE_DIARY,
          settings,
        }));
      }
    }
    else {
      const { features, [INTERNATIONALIZATION]: _unused, ...rest } = formData.page1section1;
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
