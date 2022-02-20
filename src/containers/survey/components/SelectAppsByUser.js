// @flow

import { useContext } from 'react';

import { Map, Set } from 'immutable';
import {
  Checkbox,
  ChoiceGroup,
  Grid,
} from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

type Props = {
  appsData :Map;
  childOnly :boolean;
  selected :Set<string>
};

const SelectAppsByUser = (props :Props) => {
  const { appsData, childOnly, selected } = props;

  const dispatch = useContext(HourlySurveyDispatch);

  const handleOnChange = (appName :string) => {
    dispatch({ type: ACTIONS.ASSIGN_USER, childOnly, appName });
  };

  return (
    <Grid container spacing={2}>
      {
        appsData.entrySeq().map(([key, entries]) => (
          <Grid key={key} item xs={12} md={3}>
            <ChoiceGroup>
              <Checkbox
                  checked={selected.has(key)}
                  onChange={() => handleOnChange(key)}
                  id={key}
                  mode="button"
                  label={entries.get('appLabel')} />
            </ChoiceGroup>
          </Grid>
        ))
      }
    </Grid>
  );
};

export default SelectAppsByUser;
