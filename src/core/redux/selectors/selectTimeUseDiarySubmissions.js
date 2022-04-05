/*
 * @flow
 */

import { Map, getIn } from 'immutable';

import { TIME_USE_DIARY, TIME_USE_DIARY_SUBMISSIONS } from '../../../common/constants';

export default function selectTimeUseDiarySubmissions() {

  return (state :Map) :Map => getIn(state, [TIME_USE_DIARY, TIME_USE_DIARY_SUBMISSIONS]) || Map();
}
