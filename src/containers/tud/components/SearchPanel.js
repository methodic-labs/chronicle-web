import styled from 'styled-components';

import { isPending } from '../../../common/utils';
import {
  Button,
  DatePicker,
  Label,
  Typography
} from '../../../lattice-ui-kit';

const SearchGrid = styled.div`
  align-items: end;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: auto auto 1fr 200px;
`;

const SearchPanel = (props) => {
  const {
    endDate,
    getSubmissionsRS,
    onGetSubmissions,
    onSetDate,
    startDate,
  } = props;

  return (
    <>
      <Typography variant="body2" gutterBottom>
        Search
      </Typography>
      <SearchGrid>
        <div>
          <Label subtle> Start Date </Label>
          <DatePicker
              value={startDate}
              onChange={(value) => onSetDate('selectedStartDate', value)} />
        </div>
        <div>
          <Label subtle> End Date </Label>
          <DatePicker
              value={endDate}
              onChange={(value) => onSetDate('selectedEndDate', value)} />
        </div>
        <div />
        <Button
            disabled={!endDate || !startDate}
            isLoading={isPending(getSubmissionsRS)}
            onClick={onGetSubmissions}>
          Search
        </Button>
      </SearchGrid>
    </>
  );
};

export default SearchPanel;
