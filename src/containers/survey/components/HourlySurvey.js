// @flow
import { useContext } from 'react';

import { List, Map, Set } from 'immutable';
import {
  // $FlowFixMe
  Box,
  Button
} from 'lattice-ui-kit';

import HourlySurveyInstructions from './HourlySurveyInstructions';
import SelectAppUsageTimeSlots from './SelectAppUsageTimeSlots';
import SelectAppsByUser from './SelectAppsByUser';
import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

type Props = {
  data :Map;
  isSubmitting :boolean;
  state :Object;
};

const HourlySurvey = (props :Props) => {

  const { data, state, isSubmitting } = props;

  const {
    childOnlyApps,
    sharedApps,
    childHourlySelections,
    otherChildHourlySelections,
    step
  } = state;

  const isFinalStep = step === 4;

  const dispatch = useContext(HourlySurveyDispatch);

  const getInstructionText = () => {
    switch (step) {
      case 1:
        return 'Select the apps that were used ONLY by your child';

      case 2:
        return 'Select the apps that were used by both your child and others';
      case 3:
        return 'Select the time(s) when  your  child  was the  primary user (at least 90%  of the time)';
      default:
        return 'For the remaining times, select the times your child used the app at all';
    }
  };

  const getChildApppsOtherOptions = () => {
    const filtered = data.filter((val, key) => sharedApps.has(key)).asMutable();

    filtered.forEach((val, appName) => {
      const entities :List = val.get('entities');

      const target = entities
        .filterNot((entity) => childHourlySelections.get(appName, Set()).has(entity.keySeq().first()));

      filtered.setIn([appName, 'entities'], target);
    });
    return filtered;
  };

  const handleOnSubmit = () => {
    if (!isFinalStep) {
      dispatch({ type: ACTIONS.NEXT_STEP });
      return;
    }
    dispatch({ type: ACTIONS.SHOW_CONFIRM_MODAL });
  };

  const sharedAppsData = data.filterNot((val, key) => childOnlyApps.has(key));
  const childAppsOptions = data.filter((val, key) => sharedApps.has(key));

  const childAppsOtherOptions = getChildApppsOtherOptions();

  const buttonText = step === 0 ? 'Begin Survey' : 'Submit';

  if (step === 0) {
    return <HourlySurveyInstructions noApps={data.isEmpty()} />;
  }

  return (
    <Box>
      <Box mb="20px" fontWeight={500}>
        {getInstructionText()}
      </Box>
      {
        step === 1 && <SelectAppsByUser childOnly appsData={data} selected={childOnlyApps} />
      }
      {
        step === 2 && (
          <SelectAppsByUser childOnly={false} appsData={sharedAppsData} selected={sharedApps} />
        )
      }

      {
        step === 3 && (
          <SelectAppUsageTimeSlots
              onChangeAction={ACTIONS.CHILD_SELECT_TIME}
              appsData={childAppsOptions}
              selected={childHourlySelections} />
        )
      }

      {
        step === 4 && (
          <SelectAppUsageTimeSlots
              onChangeAction={ACTIONS.OTHER_CHILD_SELECT_TIME}
              appsData={childAppsOtherOptions}
              selected={otherChildHourlySelections} />
        )
      }
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
            disabled={step === 0 || isSubmitting}
            onClick={() => dispatch({ type: ACTIONS.PREV_STEP })}>
          Back
        </Button>
        <Button disabled={data.isEmpty()} color="primary" onClick={handleOnSubmit} isLoading={isSubmitting}>
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default HourlySurvey;
