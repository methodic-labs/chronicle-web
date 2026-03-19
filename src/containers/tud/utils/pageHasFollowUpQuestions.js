import _get from 'lodash/get';

import { HAS_FOLLOWUP_QUESTIONS } from '../../../common/constants';
import { DataProcessingUtils } from '../../../lattice-fabricate';

const { getPageSectionKey } = DataProcessingUtils;

export default function pageHasFollowUpQuestions(page, data) {
  return _get(data, [getPageSectionKey(page, 0), HAS_FOLLOWUP_QUESTIONS], false);
}
