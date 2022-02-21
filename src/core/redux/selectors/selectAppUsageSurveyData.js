/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { APP_USAGE_SURVEY, APP_USAGE_SURVEY_DATA } from '../../../common/constants';

export default function selectAppUsageSurveyData() {

  return (state :Map) :Map => getIn(state, [APP_USAGE_SURVEY, APP_USAGE_SURVEY_DATA]) || Map();
}
