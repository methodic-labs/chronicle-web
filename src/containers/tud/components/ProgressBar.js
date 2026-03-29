import { withStyles } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Colors, LinearProgress, Typography } from '../../../lattice-ui-kit';

const { NEUTRAL } = Colors;

const TimeUseDiaryProgress = withStyles(() => ({
  root: {
    height: 12,
    borderRadius: 6,
  },
  bar: {
    borderRadius: 6,
  },
  colorPrimary: {
    backgroundColor: NEUTRAL.N50,
  },
}))(LinearProgress);

const Grid = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: ${(props) => `${props.completedRatio}fr auto`};
`;

const Wrapper = styled.div`
  background: white;
  margin-bottom: 10px;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ProgressLabelWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-top: 5px;

  :last-of-type {
    padding-left: 10px;
  }
`;

const validateDateTimes = (dateTimes) => (
  dateTimes.every((dateTime) => dateTime && dateTime.isValid)
);

const ProgressBar = (props) => {

  const {
    currentTime,
    dayEndTime,
    dayStartTime,
    is12hourFormat,
    isDayActivityPage,
  } = props;

  const [completedRatio, setCompletedRatio] = useState(0);

  useEffect(() => {
    if (validateDateTimes([dayStartTime, dayEndTime, currentTime])) {
      const totalTimeDiff = dayEndTime.diff(dayStartTime).toObject().milliseconds;
      const completed = currentTime.diff(dayStartTime).toObject().milliseconds;

      let ratio = [
        completed / totalTimeDiff,
        (totalTimeDiff - completed) / totalTimeDiff
      ];

      if (ratio[0] < 0) ratio = [0, 1];
      if (ratio[1] < 0) ratio = [1, 0];

      setCompletedRatio(ratio[0]);
    }
  }, [dayStartTime, dayEndTime, currentTime]);

  if (!isDayActivityPage) {
    return null;
  }

  const formatTime = (input) => {
    if (!validateDateTimes([input])) return null;

    return is12hourFormat
      ? input.toLocaleString(DateTime.TIME_SIMPLE)
      : input.toLocaleString(DateTime.TIME_24_SIMPLE);
  };

  const isCompleted = completedRatio === 1;
  const zeroProgress = completedRatio === 0;

  return (
    <Wrapper>
      <TimeUseDiaryProgress variant="determinate" value={completedRatio * 100} />
      <Grid completedRatio={completedRatio}>
        <ProgressLabelWrapper>
          <Typography
              noWrap
              variant="overline">
            {formatTime(dayStartTime)}
          </Typography>
        </ProgressLabelWrapper>
        <ProgressLabelWrapper>
          {
            <Typography
                noWrap
                variant="overline">
              {!isCompleted && !zeroProgress && formatTime(currentTime)}
            </Typography>
          }
          {
            <Typography
                align="right"
                noWrap
                variant="overline">
              {formatTime(dayEndTime)}
            </Typography>
          }
        </ProgressLabelWrapper>
      </Grid>
    </Wrapper>
  );
};

export default ProgressBar;
