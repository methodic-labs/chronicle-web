// @flow
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  CardStack,
  Typography,
} from 'lattice-ui-kit';

import StudiesTable from './components/StudiesTable';
import SummaryLinePlot from './components/SummaryLinePlot';
import SummaryStats from './components/SummaryStats';

import OpenLatticeIcon from '../../assets/images/ol_icon.png';

const DashboardContainer = () => (
  <AppContainerWrapper>
    <AppHeaderWrapper appIcon={OpenLatticeIcon} appTitle="Chronicle" />
    <AppContentWrapper>
      <CardStack>
        <Typography variant="h1">Global Dashboard</Typography>
        <SummaryStats />
        <SummaryLinePlot />
        <StudiesTable />
      </CardStack>
    </AppContentWrapper>
  </AppContainerWrapper>
);

export default DashboardContainer;
