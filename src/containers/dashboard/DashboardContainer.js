// @flow
import {
  CardStack,
  Typography,
} from 'lattice-ui-kit';

import AllStudiesContainer from './AllStudiesContainer';
import SummaryLinePlot from './components/SummaryLinePlot';
import SummaryStatsContainer from './SummaryStatsContainer';

const DashboardContainer = () => (
  <CardStack>
    <Typography variant="h1">Global Dashboard</Typography>
    <SummaryStatsContainer />
    <SummaryLinePlot />
    <AllStudiesContainer />
  </CardStack>
);

export default DashboardContainer;
