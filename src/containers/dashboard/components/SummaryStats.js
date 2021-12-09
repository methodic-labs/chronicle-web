// @flow
import styled from 'styled-components';
import { faBook, faUniversity, faUsers } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  // $FlowFixMe
  Avatar,
  // $FlowFixMe
  Box,
  Colors,
  // $FlowFixMe
  Grid,
} from 'lattice-ui-kit';

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
    <FontAwesomeIcon icon={faUniversity} fixedWidth />
  </StyledAvatar>
);

const StudiesAvatar = () => (
  <StyledAvatar $backgroundColor={BLUE.B200}>
    <FontAwesomeIcon icon={faBook} fixedWidth />
  </StyledAvatar>
);

const ParticipantsAvatar = () => (
  <StyledAvatar $backgroundColor={TEAL.T200}>
    <FontAwesomeIcon icon={faUsers} fixedWidth />
  </StyledAvatar>
);

type SummaryStatsProps = {
  data :Map;
  loading :boolean;
};

const SummaryStats = ({
  data,
  loading
} :SummaryStatsProps) => (
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
