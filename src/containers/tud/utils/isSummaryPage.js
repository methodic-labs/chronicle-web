import { YESTERDAY } from '../../../common/constants';
import isDayComplete from './isDayComplete';
import isNightActivityPage from './isNightActivityPage';
import isWakeUpPage from './isWakeUpPage';

export default function isSummaryPage(page, data, activityDay, enableChangesForOhioStateUniversity) {
  const previousPage = page - 1;
  // if activity day is "yesterday", the previous page is either:
  //   1. the night activity page
  //   OR
  //   2. the "what time did your child wake up this morning?" page
  //      ONLY IF the "enableChangesForOhioStateUniversity" setting is true
  if (activityDay === YESTERDAY) {
    if (enableChangesForOhioStateUniversity) {
      return isWakeUpPage(previousPage, data, activityDay, enableChangesForOhioStateUniversity);
    }
    return isNightActivityPage(previousPage, data, activityDay);
  }
  return isDayComplete(previousPage, data);
}
