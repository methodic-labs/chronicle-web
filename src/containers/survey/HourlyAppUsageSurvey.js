// @flow
import { useEffect, useReducer } from 'react';

import { Map } from 'immutable';
import {
  AppContainerWrapper,
  AppContentWrapper,
  Box,
  Button,
  Card,
  CardSegment,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import HourlySurveyDispatch from './components/HourlySurveyDispatch';
import HourlySurveyInstructions from './components/HourlySurveyInstructions';
import HourlyUsageSurveyAppBar from './components/HourlyUsageSurveyAppBar';
import SelectAppUsageTimeSlots from './components/SelectAppUsageTimeSlots';
import SelectAppsByUser from './components/SelectAppsByUser';
import SubmissionSuccessful from './components/SubmissionSuccessful';

import BasicErrorComponent from '../shared/BasicErrorComponent';

const { isFailure, isSuccess } = ReduxUtils;

const initialState = {
  childOnlyApps: new Set(),
  sharedApps: new Set(),
  step: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'assign_user': {
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
    case 'next_step': {
      return {
        ...state,
        step: state.step + 1
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
  getUserAppsRS :?RequestState;
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
    getUserAppsRS,
    submitSurveyRS,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const sharedAppsData = data.filterNot((val, key) => state.childOnlyApps.has(key));

  const { step } = state;

  const buttonText = step === 0 ? 'Next' : 'Submit';

  return (
    <HourlySurveyDispatch.Provider value={dispatch}>
      <AppContainerWrapper>
        <HourlyUsageSurveyAppBar date={date} step={step} />
        <AppContentWrapper>
          <Card>
            <CardSegment noBleed>
              {
                isSuccess(submitSurveyRS) && <SubmissionSuccessful />
              }
              {
                isFailure(submitSurveyRS) && <BasicErrorComponent />
              }
              {
                step === 0 && <HourlySurveyInstructions />
              }
              {
                step === 1 && <SelectAppsByUser childOnly appsData={data} selected={state.childOnlyApps} />
              }
              {
                step === 2 && (
                  <SelectAppsByUser childOnly={false} appsData={sharedAppsData} selected={state.sharedApps} />
                )
              }

              {
                step === 3 && <SelectAppUsageTimeSlots />
              }

              {
                step === 4 && <SelectAppUsageTimeSlots />
              }
              <Box textAlign="center" mt="20px">
                <Button color="primary" onClick={() => dispatch({ type: 'next_step' })}>
                  {buttonText}
                </Button>
              </Box>
            </CardSegment>
          </Card>
        </AppContentWrapper>
      </AppContainerWrapper>
    </HourlySurveyDispatch.Provider>
  );
};

export default HourlyAppUsageSurvey;
