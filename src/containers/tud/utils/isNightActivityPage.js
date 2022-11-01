import { TODAY } from '../../../common/constants';
import isDayComplete from './isDayComplete';

export default function isNightActivityPage(page, activityDay, data) {
  if (activityDay === TODAY) {
    return page === 3;
  }
  return isDayComplete(page, data);
}
