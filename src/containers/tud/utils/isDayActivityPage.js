import getFirstActivityPage from './getFirstActivityPage';
import isNightActivityPage from './isNightActivityPage';
import isSummaryPage from './isSummaryPage';
import isWakeUpPage from './isWakeUpPage';

export default function isDayActivityPage(page, data, activityDay, enableChangesForOSU) {
  return page >= getFirstActivityPage(activityDay)
    && !isSummaryPage(page, data, activityDay, enableChangesForOSU)
    && !isWakeUpPage(page, data, activityDay, enableChangesForOSU)
    && !isNightActivityPage(page, data, activityDay);
}
