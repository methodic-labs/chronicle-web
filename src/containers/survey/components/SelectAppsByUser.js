import { Checkbox, ChoiceGroup, Grid } from 'lattice-ui-kit';
import { useContext } from 'react';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const SelectAppsByUser = ({ appsData, selected }) => {
  const dispatch = useContext(HourlySurveyDispatch);

  const handleOnChange = (appName) => {
    dispatch({ type: ACTIONS.ASSIGN_USER, appName });
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
