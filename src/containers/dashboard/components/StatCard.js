import styled from 'styled-components';

import {
  Card,
  CardHeader,
  Skeleton,
  Typography,
} from '../../../lattice-ui-kit';

const StyledHeader = styled(CardHeader)`
  align-items: center;
`;

const StyledContent = styled.div`
  padding: 0 16px 16px;
`;

const StatCard = ({
  avatar,
  loading = false,
  title,
  value = '---',
}) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <Card>
      <StyledHeader borderless padding="1em" vertical={false}>
        {avatar}
        <Typography
            color="textSecondary"
            component="h2"
            noWrap
            variant="body2">
          {title}
        </Typography>
      </StyledHeader>
      <StyledContent>
        <Typography
            align="center"
            variant="h2"
            component="p">
          { loading ? <Skeleton width="100%" /> : formattedValue}
        </Typography>
      </StyledContent>
    </Card>
  );
};

export default StatCard;
