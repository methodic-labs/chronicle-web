// @flow
import { useEffect, useState } from 'react';

import {
  AppBar,
  Box,
  Toolbar,
  Typography
} from 'lattice-ui-kit';

type Props = {
  step :number;
  date :string
}

const HourlyUsageSurveyAppBar = ({ date, step } :Props) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (step === 0) {
      setTitle(`Survey ${date}`);
    }
    else {
      setTitle(`Step-${step}`);
    }
  }, [step, date]);
  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HourlyUsageSurveyAppBar;
