// @flow
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
} from 'lattice-ui-kit';

import SummaryLinePlot from './components/SummaryLinePlot';
import SummaryStats from './components/SummaryStats';

import OpenLatticeIcon from '../../assets/images/ol_icon.png';

const DashboardContainer = () => (
  <AppContainerWrapper>
    <AppHeaderWrapper appIcon={OpenLatticeIcon} appTitle="Chronicle" />
    <AppContentWrapper>
      <SummaryStats />
      <SummaryLinePlot />
    </AppContentWrapper>
  </AppContainerWrapper>
);

export default DashboardContainer;
