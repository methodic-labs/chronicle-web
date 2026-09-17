/*
 * @flow
 */

import { List, Map, getIn } from 'immutable';

import { STUDIES, USER_SEARCH_RESULTS } from '../../../common/constants';

const EMPTY_RESULTS :List = List();

export default function selectUserSearchResults() {

  return (state :Map) :List => getIn(state, [STUDIES, USER_SEARCH_RESULTS]) || EMPTY_RESULTS;
}
