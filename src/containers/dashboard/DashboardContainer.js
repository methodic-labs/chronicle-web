// @flow
import { AuthUtils } from 'lattice-auth';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  AppNavigationWrapper,
  CardStack,
  Typography,
} from 'lattice-ui-kit';
import { NavLink } from 'react-router-dom';

import StudiesTable from './components/StudiesTable';
import SummaryLinePlot from './components/SummaryLinePlot';
import SummaryStats from './components/SummaryStats';

import OpenLatticeIcon from '../../assets/images/ol_icon.png';
import { DASHBOARD, ROOT, STUDIES } from '../../core/router/Routes';

const DashboardContainer = () => (
  <AppContainerWrapper>
    <AppHeaderWrapper appIcon={OpenLatticeIcon} appTitle="Chronicle">
      <AppNavigationWrapper>
        <NavLink to={ROOT} />
        <NavLink to={STUDIES}> Studies </NavLink>
        { AuthUtils.isAdmin() && <NavLink to={DASHBOARD}>Dashboard</NavLink>}
      </AppNavigationWrapper>
    </AppHeaderWrapper>
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
