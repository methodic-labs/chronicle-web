// @flow
import { useContext } from 'react';

import styled from 'styled-components';
import { Map, Set } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Checkbox,
  Grid,
} from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

type Props = {
  data :Map;
  initial :boolean;
  initialSelections :Map;
  options :Map;
  selected :Map;
};

const CardTitle = styled.div`
  text-align: center;
  width: 100%;
  overflow-wrap: break-word;
`;

const SelectAppUsageTimeSlots = (props :Props) => {
  const {
    data,
    initial,
    options,
    selected,
    initialSelections,
  } = props;

  const dispatch = useContext(HourlySurveyDispatch);

  const isSelected = (timeRange :string, appName :string) => selected.get(appName, Set()).includes(timeRange);

  const handleOnChange = (timeRange :string, appName :string) => {

    dispatch({
      type: ACTIONS.SELECT_TIME_RANGE,
      appName,
      initial,
      timeRange,
    });
  };

  const applyFilter = (timeRange :string, appName :String) => (
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
                <CardTitle>
                  { data.getIn([appName, 'appLabel'])}
                </CardTitle>
              </CardHeader>
              <CardSegment noBleed>
                <Grid container spacing={2}>
                  {
                    timeRanges.sort().map((timeRange :string) => (
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
