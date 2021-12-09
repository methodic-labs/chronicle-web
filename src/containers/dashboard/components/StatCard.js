// @flow
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  // $FlowFixMe
  Skeleton,
  Typography,
} from 'lattice-ui-kit';

const StyledHeader = styled(CardHeader)`
  align-items: center;
`;

const StyledContent = styled.div`
  padding: 0 16px 16px;
`;

type StatCardProps = {
  avatar :React$Node;
  loading :boolean;
  title :string;
  value :number | string;
};

const StatCard = ({
  avatar,
  loading = false,
  title,
  value = '---',
} :StatCardProps) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <Card>
      <StyledHeader borderless padding="1em" vertical={false}>
        {avatar}
        <Typography
            color="textSecondary"
            component="h2"
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
