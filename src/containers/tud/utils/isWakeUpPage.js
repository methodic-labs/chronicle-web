import { TODAY } from '../../../common/constants';
import isNightActivityPage from './isNightActivityPage';

export default function isWakeUpPage(page, data, activityDay, enableChangesForOhioStateUniversity) {
  // this page only exists when activity day is "yesterday" AND the study has
  // the "enableChangesForOhioStateUniversity" setting set to true
  if (activityDay === TODAY) {
    return false;
  }
  return enableChangesForOhioStateUniversity
    && isNightActivityPage(page - 1, data, activityDay);
}
