// @flow
import { useEffect, useState } from 'react';

import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Box,
  Colors,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from 'lattice-ui-kit';

type Props = {
  step :number;
  date :string
}

// TODO: overlay  https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_overlay_text

const HourlyUsageSurveyAppBar = ({ date, step } :Props) => {
  const [title, setTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (step === 0) {
      setTitle(`Survey ${date}`);
    }
    else {
      setTitle(`Step-${step}`);
    }
  }, [step, date]);

  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOnClickMenuItem = () => {

  };

  return (
    <Box mb="50px">
      <AppBar>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            {title}
          </Box>
          {
            step !== 0 && (
              <IconButton
                  aria-controls="app_bar_menu"
                  aria-haspopup="true"
                  onClick={handleOnClick}>
                <FontAwesomeIcon
                    color={Colors.WHITE}
                    icon={faEllipsisV} />
              </IconButton>
            )
          }
          <Menu
              id="app_bar_menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleOnCloseMenu}>
            <MenuItem onClick={handleOnClickMenuItem}>
              Instructions
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HourlyUsageSurveyAppBar;
