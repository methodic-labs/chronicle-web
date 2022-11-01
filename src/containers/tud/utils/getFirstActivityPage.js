import { TODAY } from '../../../common/constants';

export default function getFirstActivityPage(activityDay) {
  if (activityDay === TODAY) {
    return 4;
  }
  return 3;
}
