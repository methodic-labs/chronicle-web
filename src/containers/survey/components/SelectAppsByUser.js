// @flow

import { useContext } from 'react';

import { Map } from 'immutable';
import {
  Checkbox,
  ChoiceGroup,
  // $FlowFixMe
  Grid,
} from 'lattice-ui-kit';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

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
                  label={entries.get(TITLE_FQN)} />
            </ChoiceGroup>
          </Grid>
        ))
      }
    </Grid>
  );
};

export default SelectAppsByUser;
