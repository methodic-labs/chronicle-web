import { ACTIVITY_END_TIME, DAY_END_TIME } from '../../../common/constants';
import { DAY_SPAN_PAGE } from '../constants';
import getDateTimeFromData from './getDateTimeFromData';
import pageHasFollowUpQuestions from './pageHasFollowUpQuestions';

export default function isDayComplete(page, data) {
  const prevEndTime = getDateTimeFromData(page, ACTIVITY_END_TIME, data);
  const dayEndTime = getDateTimeFromData(DAY_SPAN_PAGE, DAY_END_TIME, data);
  return prevEndTime.isValid
    && dayEndTime.isValid
    && prevEndTime.equals(dayEndTime)
    && pageHasFollowUpQuestions(page, data);
}
