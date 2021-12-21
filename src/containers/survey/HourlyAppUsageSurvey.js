// @flow
import { useEffect, useReducer } from 'react';

import { Map, Set, fromJS } from 'immutable';
import {
  AppContainerWrapper,
  AppContentWrapper,
  Card,
  CardSegment,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import ConfirmSurveySubmissionModal from './components/ConfirmSurveySubmissionModal';
import HourlySurvey from './components/HourlySurvey';
import HourlyUsageSurveyAppBar from './components/HourlyUsageSurveyAppBar';
import SubmissionSuccessful from './components/SubmissionSuccessful';
import HourlySurveyDispatch, { ACTIONS } from './components/HourlySurveyDispatch';
import { submitSurvey } from './SurveyActions';

import BasicErrorComponent from '../shared/BasicErrorComponent';
import { PROPERTY_TYPE_FQNS } from '../../core/edm/constants/FullyQualifiedNames';

const { isFailure, isSuccess, isPending } = ReduxUtils;

const { USER_FQN } = PROPERTY_TYPE_FQNS;

const initialState = {
  childOnlyApps: Set().asMutable(),
  sharedApps: Set().asMutable(),
  childHourlySelections: Map().asMutable(),
  otherChildHourlySelections: Map().asMutable(),
  isConfirmModalVisible: false,
  isSubmissionConfirmed: false,
  step: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ASSIGN_USER: {
      const { childOnly, appName } = action;

      const { childOnlyApps, sharedApps } = state;

      const selected = childOnly ? childOnlyApps : sharedApps;

      if (selected.has(appName)) {
        selected.delete(appName);
      }
      else {
        selected.add(appName);
      }

      if (childOnly) {
        return {
          ...state,
          childOnlyApps: selected
        };
      }
      return {
        ...state,
        sharedApps: selected
      };
    }
    case ACTIONS.OTHER_CHILD_SELECT_TIME: {
      const { appName, id } = action;
      const { otherChildHourlySelections } = state;

      if (otherChildHourlySelections.get(appName, Set()).has(id)) {
        otherChildHourlySelections.update(appName, Set(), (current) => current.delete(id));
      }
      else {
        otherChildHourlySelections.update(appName, Set(), (current) => current.add(id));
      }
      return {
        ...state,
        otherChildHourlySelections
      };
    }

    case ACTIONS.CHILD_SELECT_TIME: {
      const { appName, id } = action;
      const { childHourlySelections } = state;

      if (childHourlySelections.get(appName, Set()).has(id)) {
        childHourlySelections.update(appName, Set(), (current) => current.delete(id));
      }
      else {
        childHourlySelections.update(appName, Set(), (current) => current.add(id));
      }
      return {
        ...state,
        childHourlySelections
      };
    }
    case ACTIONS.NEXT_STEP: {
      return {
        ...state,
        step: state.step + 1
      };
    }
    case ACTIONS.PREV_STEP: {
      return {
        ...state,
        step: state.step - 1
      };
    }
    case ACTIONS.CONFIRM_SUBMIT: {
      return {
        ...state,
        isSubmissionConfirmed: true,
        isConfirmModalVisible: false
      };
    }
    case ACTIONS.CANCEL_SUBMIT: {
      return {
        ...state,
        isConfirmModalVisible: false
      };
    }
    case ACTIONS.SHOW_CONFIRM_MODAL: {
      return {
        ...state,
        isConfirmModalVisible: true
      };
    }
    default:
      return state;
  }
};

type Props = {
  data :Map;
  date :string;
  submitSurveyRS :?RequestState;
  participantId :string;
  organizationId :UUID;
  studyId :UUID ;
};

const HourlyAppUsageSurvey = (props :Props) => {
  const {
    data,
    date,
    studyId,
    organizationId,
    participantId,
    submitSurveyRS,
  } = props;

  const storeDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    step,
    childOnlyApps,
    isConfirmModalVisible,
    childHourlySelections,
    otherChildHourlySelections,
    isSubmissionConfirmed
  } = state;

  const createSubmissionData = () => {

    const childOnlyIds = childOnlyApps
      .map((app) => data.getIn([app, 'entities']).map((entity) => entity.keySeq())).flatten();

    const otherIds = childHourlySelections.valueSeq()
      .concat(otherChildHourlySelections.valueSeq()).toSet().flatten();

    return childOnlyIds.concat(otherIds)
      .toMap()
      .mapEntries((entry) => [entry[0], fromJS({ [USER_FQN.toString()]: ['Target child'] })])
      .toJS();
  };

  useEffect(() => {
    if (isSubmissionConfirmed) {
      storeDispatch(submitSurvey({
        submissionData: createSubmissionData(),
        organizationId,
        participantId,
        studyId
      }));
    }
  }, [isSubmissionConfirmed]);

  const hasSubmitted = isSuccess(submitSurveyRS) || isFailure(submitSurveyRS);

  const isSubmitting = isPending(submitSurveyRS);

  const SubmissionCompleted = () => (
    <>
      {
        isSuccess(submitSurveyRS)
          ? <SubmissionSuccessful />
          : <BasicErrorComponent />
      }
    </>
  );

  return (
    <HourlySurveyDispatch.Provider value={dispatch}>
      <AppContainerWrapper>
        <HourlyUsageSurveyAppBar date={date} step={step} />
        <AppContentWrapper>
          <Card>
            <CardSegment noBleed>
              {
                hasSubmitted
                  ? <SubmissionCompleted />
                  : <HourlySurvey data={data} state={state} isSubmitting={isSubmitting} />
              }
            </CardSegment>
          </Card>
        </AppContentWrapper>
      </AppContainerWrapper>
      {
        isConfirmModalVisible && <ConfirmSurveySubmissionModal />
      }
    </HourlySurveyDispatch.Provider>
  );
};

export default HourlyAppUsageSurvey;
