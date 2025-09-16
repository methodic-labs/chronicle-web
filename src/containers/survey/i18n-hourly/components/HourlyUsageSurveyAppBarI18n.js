import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
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
import { useTranslation } from 'react-i18next';

import HourlySurveyTranslationKeys from '../constants/HourlySurveyTranslationKeys';
import HourlySurveyDispatch, { ACTIONS } from '../../components/HourlySurveyDispatch';

const HourlyUsageSurveyAppBarI18n = ({ step }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useContext(HourlySurveyDispatch);

  useEffect(() => {
    if (step === 0) {
      setTitle(t(HourlySurveyTranslationKeys.TITLE));
    }
    else {
      setTitle(t(HourlySurveyTranslationKeys.STEP_TITLE, { step }));
    }
  }, [step, t]);

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
                    icon={faEllipsisVertical} />
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
              {t(HourlySurveyTranslationKeys.INSTRUCTIONS)}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HourlyUsageSurveyAppBarI18n;