// @flow
import { useContext } from 'react';

import { Map, Set } from 'immutable';
import {
  // $FlowFixMe
  Box,
  Card,
  CardHeader,
  CardSegment,
  Checkbox,
  // $FlowFixMe
  Grid
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import HourlySurveyDispatch from './HourlySurveyDispatch';

import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';

const { TITLE_FQN, DATE_TIME_FQN } = PROPERTY_TYPE_FQNS;

type Props = {
  appsData :Map;
  selected :Map;
  onChangeAction :string;
};

const SelectAppUsageTimeSlots = (props :Props) => {
  const { appsData, selected, onChangeAction } = props;

  const dispatch = useContext(HourlySurveyDispatch);

  const getTimeDescription = (timeStr :string) => {
    const tokens = timeStr.split(' ');
    return `${tokens[0].split(':')[0]}${tokens[1].toLowerCase()}`;
  };

  const getCheckboxLabel = (dateStr :string) => {
    const date = DateTime.fromISO(dateStr);
    const start = date.startOf('hour').toLocaleString(DateTime.TIME_SIMPLE);
    const end = date.plus({ hours: 1 }).startOf('hour').toLocaleString(DateTime.TIME_SIMPLE);

    return `${getTimeDescription(start)} - ${getTimeDescription(end)}`;
  };

  const isSelected = (entity :Map, appName :string) => {
    const id = entity.keySeq().first();

    return selected.get(appName, Set()).includes(id);
  };

  const handleOnChange = (entity :Map, appName :string) => {
    const id = entity.keySeq().first();

    dispatch({
      type: onChangeAction,
      id,
      appName,
    });
  };

  return (
    <Grid container spacing={2}>
      {
        appsData.filterNot((val) => val.get('entities').isEmpty()).entrySeq().map(([key, entries]) => (
          <Grid item xs={12} md={4} key={key}>
            <Card>
              <CardHeader mode="secondary" padding="sm">
                <Box textAlign="center" width="100%">
                  { entries.get(TITLE_FQN) }
                </Box>
              </CardHeader>
              <CardSegment noBleed>
                <Grid container spacing={2}>
                  {
                    entries.get('entities')
                      .sortBy((entity) => entity.first().get(DATE_TIME_FQN)).map((entity :Map) => (
                        <Grid item xs={6} key={entity.keySeq().first()}>
                          <Checkbox
                              checked={isSelected(entity, key)}
                              label={getCheckboxLabel(entity.first().get(DATE_TIME_FQN))}
                              onChange={() => handleOnChange(entity, key)} />
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
