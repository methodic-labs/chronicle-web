import { ACTIVITY_END_TIME, DAY_END_TIME, TODAY } from '../../../common/constants';
import { DAY_SPAN_PAGE } from '../constants';
import getDateTimeFromData from './getDateTimeFromData';
import pageHasFollowUpQuestions from './pageHasFollowUpQuestions';

export default function isSummaryPage(page, activityDay, data) {
  const prevPage = activityDay === TODAY ? page - 1 : page - 2;
  const prevEndTime = getDateTimeFromData(prevPage, ACTIVITY_END_TIME, data);
  const dayEndTime = getDateTimeFromData(DAY_SPAN_PAGE, DAY_END_TIME, data);
  return prevEndTime.isValid
    && dayEndTime.isValid
    && prevEndTime.equals(dayEndTime)
    && pageHasFollowUpQuestions(prevPage, data);
}
