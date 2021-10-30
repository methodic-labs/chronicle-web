import styled from 'styled-components';
import { faBook, faUniversity, faUsers } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Colors,
  Grid,
  Typography,
} from 'lattice-ui-kit';

const {
  NEUTRAL,
  TEAL,
  BLUE,
  PURPLE
} = Colors;

const StyledHeader = styled(CardHeader)`
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
  background-color: ${({ $backgroundColor }) => ($backgroundColor || NEUTRAL.N400)};
`;

const StyledContent = styled(CardContent)`
  padding: 0 16px 16px !important;
`;

const SummaryStats = () => (
  <Box>
    <Typography variant="h1">Global Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card>
          <StyledHeader borderless padding="1em" vertical={false}>
            <StyledAvatar $backgroundColor={PURPLE.P200}>
              <FontAwesomeIcon icon={faUniversity} fixedWidth />
            </StyledAvatar>
            <Typography
                color="textSecondary"
                component="h2"
                variant="body2">
              Organizations
            </Typography>
          </StyledHeader>
          <StyledContent>
            <Typography
                align="center"
                variant="h2"
                component="p">
              {(Math.floor(Math.random() * 100) + 100).toLocaleString()}
            </Typography>
          </StyledContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <StyledHeader borderless padding="1em" vertical={false}>
            <StyledAvatar $backgroundColor={BLUE.B200}>
              <FontAwesomeIcon icon={faBook} fixedWidth />
            </StyledAvatar>
            <Typography
                color="textSecondary"
                component="h2"
                variant="body2">
              Studies
            </Typography>
          </StyledHeader>
          <StyledContent>
            <Typography
                align="center"
                variant="h2"
                component="p">
              {(Math.floor(Math.random() * 200) + 200).toLocaleString()}
            </Typography>
          </StyledContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <StyledHeader borderless padding="1em" vertical={false}>
            <StyledAvatar $backgroundColor={TEAL.T200}>
              <FontAwesomeIcon icon={faUsers} fixedWidth />
            </StyledAvatar>
            <Typography
                color="textSecondary"
                component="h2"
                variant="body2">
              Participants
            </Typography>
          </StyledHeader>
          <StyledContent>
            <Typography
                align="center"
                variant="h2"
                component="p">
              {(Math.floor(Math.random() * 10000) + 2000).toLocaleString()}
            </Typography>
          </StyledContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default SummaryStats;
