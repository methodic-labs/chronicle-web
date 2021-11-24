// @flow
import {
  CardStack,
  Typography,
} from 'lattice-ui-kit';

import StudiesTable from './components/StudiesTable';
import SummaryLinePlot from './components/SummaryLinePlot';
import SummaryStats from './components/SummaryStats';

const DashboardContainer = () => (
  <CardStack>
    <Typography variant="h1">Global Dashboard</Typography>
    <SummaryStats />
    <SummaryLinePlot />
    <StudiesTable />
  </CardStack>
);

export default DashboardContainer;
