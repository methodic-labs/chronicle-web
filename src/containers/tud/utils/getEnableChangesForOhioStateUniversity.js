import { StudySettingTypes, YESTERDAY } from '../../../common/constants';

export default function getEnableChangesForOhioStateUniversity(settings, activityDay) {
  const enable = settings.getIn([StudySettingTypes.TIME_USE_DIARY, 'enableChangesForOhioStateUniversity']) || false;
  return activityDay === YESTERDAY && enable;
}
