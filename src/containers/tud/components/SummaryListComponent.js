// @flow

import styled from 'styled-components';
import { List } from 'immutable';
import {
  Button,
  Colors,
  Grid,
  Typography
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import DataTypes from '../constants/DataTypes';
import type { DataType } from '../constants/DataTypes';

const { NEUTRAL } = Colors;
const { formatAsDate } = DateTimeUtils;

const Wrapper = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto 1fr 400px;
  grid-column-gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid ${NEUTRAL.N50};

  :last-of-type {
    margin-bottom: 0;
  }
`;

const ButtonWrapper = styled(Button)`
  padding-left: 8px;
  padding-right: 8px;
`;

type Props = {
  date :DateTime;
  submissionIds :List<UUID>;
  onDownloadData :(date :DateTime, dataType :DataType) => void;
}

const SummaryListComponent = (
  {
    date,
    submissionIds,
    onDownloadData,
  } :Props
) => (
  <Wrapper>
    <Grid container spacing={3}>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          { formatAsDate(date) }
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" gutterBottom>
          { submissionIds.size }
        </Typography>
      </Grid>
    </Grid>
    <div />

    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ButtonWrapper
            fullWidth
            onClick={() => onDownloadData(date, DataTypes.SUMMARIZED)}
            size="small"
            variant="outlined">
          Summarized
        </ButtonWrapper>
      </Grid>
      <Grid item xs={4}>
        <ButtonWrapper
            fullWidth
            onClick={() => onDownloadData(date, DataTypes.DAYTIME)}
            size="small"
            variant="outlined">
          Daytime
        </ButtonWrapper>
      </Grid>
      <Grid item xs={4}>
        <ButtonWrapper
            fullWidth
            onClick={() => onDownloadData(date, DataTypes.NIGHTTIME)}
            size="small"
            variant="outlined">
          Nighttime
        </ButtonWrapper>
      </Grid>
    </Grid>
  </Wrapper>
);

export default SummaryListComponent;
