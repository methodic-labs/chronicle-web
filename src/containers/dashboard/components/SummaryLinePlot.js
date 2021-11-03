import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';
import { Card, Colors } from 'lattice-ui-kit';

import SummaryLineTooltip from './SummaryLineTooltip';

import generateLineData from '../utils/generateLineData';

const {
  TEAL,
  BLUE,
  PURPLE
} = Colors;

const StyledCard = styled(Card)`
  height: 400px;
`;

const newData = [
  {
    id: 'Organizations',
    data: generateLineData(30, 100, 200),
  },
  {
    id: 'Studies',
    data: generateLineData(30, 200, 400),
  },
  {
    id: 'Participants',
    data: generateLineData(30, 2000, 12000),
  },
];

const SummaryLinePlot = () => (
  <StyledCard>
    <ResponsiveLine
        axisBottom={{
          format: '%m/%d',
          tickValues: 'every 3 days',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Count',
          legendOffset: -50,
          legendPosition: 'middle'
        }}
        colors={[
          PURPLE.P200,
          BLUE.B200,
          TEAL.T200,
        ]}
        data={newData}
        enablePoints={false}
        enableGridX={false}
        // enableSlices="x"
        legends={[{
          anchor: 'bottom',
          direction: 'row',
          itemHeight: 16,
          itemWidth: 90,
          itemsSpacing: 5,
          translateY: 50
        }]}
        margin={{
          top: 32,
          right: 32,
          bottom: 72,
          left: 80
        }}
        tooltip={SummaryLineTooltip}
        useMesh
        xFormat="time:%m/%d"
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          useUTC: false,
          precision: 'day',
        }} />
  </StyledCard>
);

export default SummaryLinePlot;
