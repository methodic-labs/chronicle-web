import { TODAY } from '../../../common/constants';
import isDayComplete from './isDayComplete';

export default function isNightActivityPage(page, data, activityDay) {
  if (activityDay === TODAY) {
    return page === 3;
  }
  return isDayComplete(page - 1, data);
}
