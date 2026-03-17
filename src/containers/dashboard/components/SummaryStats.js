import styled from 'styled-components';
import {
  // $FlowFixMe
  Avatar,
  // $FlowFixMe
  Box,
  Colors,
  // $FlowFixMe
  Grid,
} from 'lattice-ui-kit';
import {
  BookTextIcon, LandmarkIcon, UsersIcon
} from 'lucide-react';

import StatCard from './StatCard';

const {
  NEUTRAL,
  TEAL,
  BLUE,
  PURPLE
} = Colors;

const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
  background-color: ${({ $backgroundColor }) => ($backgroundColor || NEUTRAL.N400)};
`;

const OrganizationAvatar = () => (
  <StyledAvatar $backgroundColor={PURPLE.P200}>
    <LandmarkIcon />
  </StyledAvatar>
);

const StudiesAvatar = () => (
  <StyledAvatar $backgroundColor={BLUE.B200}>
    <BookTextIcon />
  </StyledAvatar>
);

const ParticipantsAvatar = () => (
  <StyledAvatar $backgroundColor={TEAL.T200}>
    <UsersIcon />
  </StyledAvatar>
);

const SummaryStats = ({
  data,
  loading
}) => (
  <Box>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <StatCard
            avatar={<OrganizationAvatar />}
            loading={loading}
            title="Organizations"
            value={data.get('organizations')} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
            avatar={<StudiesAvatar />}
            loading={loading}
            title="Studies"
            value={data.get('studies')} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
            avatar={<ParticipantsAvatar />}
            loading={loading}
            title="Participants"
            value={data.get('participants')} />
      </Grid>
    </Grid>
  </Box>
);

export default SummaryStats;
