// @flow
import {
  CardStack,
  Typography,
} from 'lattice-ui-kit';

import AllStudiesContainer from './AllStudiesContainer';
import SummaryLinePlot from './components/SummaryLinePlot';
import SummaryStats from './components/SummaryStats';

const DashboardContainer = () => (
  <CardStack>
    <Typography variant="h1">Global Dashboard</Typography>
    <SummaryStats />
    <SummaryLinePlot />
    <AllStudiesContainer />
  </CardStack>
);

export default DashboardContainer;
