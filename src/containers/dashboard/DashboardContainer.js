// @flow
import {
  CardStack,
  Typography,
} from 'lattice-ui-kit';

import AllStudiesContainer from './AllStudiesContainer';
import SummaryStatsContainer from './SummaryStatsContainer';

const DashboardContainer = () => (
  <CardStack>
    <Typography variant="h1">Global Dashboard</Typography>
    <SummaryStatsContainer />
    <AllStudiesContainer />
  </CardStack>
);

export default DashboardContainer;
