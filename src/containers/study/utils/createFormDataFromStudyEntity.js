/*
 * @flow
 */

import { getIn, setIn } from 'immutable';

import { FEATURES } from '../../../common/constants';
import type { Study } from '../../../common/types';

const PAGE_SECTION_PREFIX = 'page';

export default function createFormDataFromStudyEntity(dataSchema :Object, study ?:Study) {

  let formData = {};

  if (!dataSchema || !study) {
    return {};
  }

  const { properties } = dataSchema;
  const pageSectionKeys = Object.keys(properties).filter((key) => key.startsWith(PAGE_SECTION_PREFIX));

  pageSectionKeys.forEach((pageSectionKey) => {
    const studyFields = getIn(properties, [pageSectionKey, 'properties'], {});
    Object.keys(studyFields).forEach((studyField) => {
      if (studyField === FEATURES) {
        const features = Object.keys(study.modules);
        formData = setIn(formData, [pageSectionKey, studyField], features);
      }
      else {
        formData = setIn(formData, [pageSectionKey, studyField], study[studyField]);
      }
    });
  });

  return formData;
}
