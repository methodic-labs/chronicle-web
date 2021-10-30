import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';
import { Card } from 'lattice-ui-kit';

const StyledCard = styled(Card)`
  height: 400px;
`;

const data = [
  {
    id: 'fake corp. A',
    data: [
      { x: '2018-01-01', y: 7 },
      { x: '2018-01-02', y: 5 },
      { x: '2018-01-03', y: 11 },
      { x: '2018-01-04', y: 9 },
      { x: '2018-01-05', y: 12 },
      { x: '2018-01-06', y: 16 },
      { x: '2018-01-07', y: 13 },
      { x: '2018-01-08', y: 13 },
    ],
  },
  {
    id: 'fake corp. B',
    data: [
      { x: '2018-01-04', y: 14 },
      { x: '2018-01-05', y: 14 },
      { x: '2018-01-06', y: 15 },
      { x: '2018-01-07', y: 11 },
      { x: '2018-01-08', y: 10 },
      { x: '2018-01-09', y: 12 },
      { x: '2018-01-10', y: 9 },
      { x: '2018-01-11', y: 7 },
    ],
  },
];

const SummaryLinePlot = () => (
  <StyledCard>
    <ResponsiveLine
        // axisBottom={{
        //   format: '%b %d',
        //   tickValues: 'every 2 days',
        //   legend: 'time scale',
        //   legendOffset: -12,
        // }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Count',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          useUTC: false,
          precision: 'day',
        }}
        data={data}
        margin={{
          top: 50,
          right: 110,
          bottom: 50,
          left: 60
        }}
        xFormat="time:%Y-%m-%d"
        yFormat=" >-.2f" />
  </StyledCard>
);

export default SummaryLinePlot;
