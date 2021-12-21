// @flow
import { Box } from 'lattice-ui-kit';

type Props = {
  noApps :boolean;
}
const HourlySurveyInstructions = ({ noApps } :Props) => {
  if (noApps) {
    return (
      <Box textAlign="center">
        No apps found. Please try refreshing page.
      </Box>
    );
  }
  return (
    <Box>
      <Box mb="20px">
        Please complete this short survey to let us know which of the apps
        used in the last 24 hours were used by the child enrolled in our study. The
        survey will refer to this child as &quot;your child&quot;.
      </Box>
      <Box>
        For instructions at each step please click on 3 dots to the top-right of the app.
      </Box>
    </Box>
  );
};

export default HourlySurveyInstructions;
