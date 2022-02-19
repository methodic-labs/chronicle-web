// @flow

import { List, Map, Set } from 'immutable';
// $FlowFixMe
import { Box } from 'lattice-ui-kit';

import HourlySurveyInstructions from './HourlySurveyInstructions';
import SelectAppUsageTimeSlots from './SelectAppUsageTimeSlots';
import SelectAppsByUser from './SelectAppsByUser';
import SurveyButtons from './SurveyButtons';
import { ACTIONS } from './HourlySurveyDispatch';

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
    initialTimeRangeSelections,
    otherTimeRangeSelections,
    step
  } = state;

  const isFinalStep = step === 4;

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

  const sharedAppsData = data.filterNot((val, key) => childOnlyApps.has(key));
  const timeRangeOptions = data.filter((val, key) => sharedApps.has(key));

  // const childAppsOtherOptions = getChildApppsOtherOptions();

  const buttonText = step === 0 ? 'Begin Survey' : 'Submit';

  if (step === 0) {
    return (
      <HourlySurveyInstructions
          noApps={data.isEmpty()}
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={buttonText}
          isNextButtonDisabled={data.isEmpty()} />
    );
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
              data={data}
              initial
              initialSelections={Map()}
              options={timeRangeOptions}
              selected={initialTimeRangeSelections} />
        )
      }

      {
        step === 4 && (
          <SelectAppUsageTimeSlots
              data={data}
              initial={false}
              initialSelections={initialTimeRangeSelections}
              options={timeRangeOptions}
              selected={otherTimeRangeSelections} />
        )
      }
      <SurveyButtons
          step={step}
          isFinalStep={isFinalStep}
          isSubmitting={isSubmitting}
          nextButtonText={buttonText}
          isNextButtonDisabled={data.isEmpty()} />
    </Box>
  );
};

export default HourlySurvey;
