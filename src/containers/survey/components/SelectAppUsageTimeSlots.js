import { Set } from 'immutable';
import {
  Box,
  Card,
  CardHeader,
  CardSegment,
  Checkbox,
  Grid
} from 'lattice-ui-kit';
import { useContext } from 'react';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const SelectAppUsageTimeSlots = ({
  data,
  initial,
  initialSelections,
  options,
  selected,
}) => {

  const dispatch = useContext(HourlySurveyDispatch);

  const isSelected = (timeRange, appName) => selected.get(appName, Set()).includes(timeRange);

  const handleOnChange = (timeRange, appName) => {
    dispatch({
      type: ACTIONS.SELECT_TIME_RANGE,
      appName,
      initial,
      timeRange,
    });
  };

  const applyFilter = (timeRange, appName) => (
    initial ? true : !initialSelections.get(appName, Set()).has(timeRange)
  );

  const filtered = options
    .mapEntries(([k, v]) => [k, v.get('data').keySeq().filter((timeRange) => applyFilter(timeRange, k))])
    .filterNot((v) => v.isEmpty());

  return (
    <Grid container spacing={2}>
      {
        filtered.entrySeq().map(([appName, timeRanges]) => (
          <Grid item xs={12} md={4} key={appName}>
            <Card>
              <CardHeader mode="secondary" padding="sm">
                <Box sx={{
                  overflowWrap: 'break-word',
                  textAlign: 'center',
                  width: '100%',
                }}>
                  {data.getIn([appName, 'appLabel'])}
                </Box>
              </CardHeader>
              <CardSegment noBleed>
                <Grid container spacing={2}>
                  {
                    timeRanges.sort().map((timeRange) => (
                      <Grid item xs={6} key={timeRange}>
                        <Checkbox
                            checked={isSelected(timeRange, appName)}
                            label={timeRange}
                            onChange={() => handleOnChange(timeRange, appName)} />
                      </Grid>
                    ))
                  }
                </Grid>

              </CardSegment>
            </Card>
          </Grid>
        ))
      }
    </Grid>
  );
};

export default SelectAppUsageTimeSlots;
