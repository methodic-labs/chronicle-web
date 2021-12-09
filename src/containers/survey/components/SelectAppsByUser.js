// @flow

import { useContext } from 'react';

import { Map } from 'immutable';
import {
  Checkbox,
  ChoiceGroup,
  Grid
} from 'lattice-ui-kit';

import HourlySurveyDispatch from './HourlySurveyDispatch';

import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';

const { TITLE_FQN } = PROPERTY_TYPE_FQNS;

type Props = {
  appsData :Map;
  childOnly :boolean;
  selected :Set<string>
};

const SelectAppsByUser = (props :Props) => {
  const { appsData, childOnly, selected } = props;

  const dispatch = useContext(HourlySurveyDispatch);

  const handleOnChange = (appName :string) => {
    dispatch({ type: 'assign_user', childOnly, appName });
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
                  label={entries.first().getIn([TITLE_FQN, 0])} />
            </ChoiceGroup>
          </Grid>
        ))
      }
    </Grid>
  );
};

export default SelectAppsByUser;
