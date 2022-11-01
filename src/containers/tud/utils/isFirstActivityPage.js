import getFirstActivityPage from './getFirstActivityPage';

export default function isFirstActivityPage(page, activityDay) {
  return page === getFirstActivityPage(activityDay);
}
