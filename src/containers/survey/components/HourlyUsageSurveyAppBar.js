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
import { useContext, useEffect, useState } from 'react';

import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const HourlyUsageSurveyAppBar = ({ step }) => {
  const [title, setTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useContext(HourlySurveyDispatch);

  useEffect(() => {
    if (step === 0) {
      setTitle('App Usage Survey');
    }
    else {
      setTitle(`Step-${step}`);
    }
  }, [step]);

  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOnClickMenuItem = () => {
    dispatch({ type: ACTIONS.TOGGLE_INSTRUCTIONS_MODAL, visible: true });
    handleOnCloseMenu();
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
