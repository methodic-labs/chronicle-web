// @flow
import { createContext } from 'react';

const HourlySurveyDispatch :any = createContext(null);

export const ACTIONS = {
  ASSIGN_USER: 'assign_user',
  CANCEL_SUBMIT: 'cancel_submit',
  CHILD_SELECT_TIME: 'child_select_time',
  CONFIRM_SUBMIT: 'confirm_submit',
  NEXT_STEP: 'next_step',
  OTHER_CHILD_SELECT_TIME: 'other_child_select_time',
  PREV_STEP: 'prev_step',
  SELECT_TIME_RANGE: 'select_time_range',
  SHOW_CONFIRM_MODAL: 'show_confirm_modal',
  TOGGLE_INSTRUCTIONS_MODAL: 'toggle_instructions_modal',
};

export default HourlySurveyDispatch;
