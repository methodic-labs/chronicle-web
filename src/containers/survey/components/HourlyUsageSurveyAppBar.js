import {
  Colors,
  IconButton,
  Menu,
  MenuItem,
  StyleUtils,
  Typography,
} from 'lattice-ui-kit';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { TranslationKeys } from '../constants';
import HourlySurveyDispatch, { ACTIONS } from './HourlySurveyDispatch';

const { NEUTRAL } = Colors;
const { media } = StyleUtils;

const Wrapper = styled.div`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid ${NEUTRAL.N100};
  display: flex;
  justify-content: space-between;
  min-height: 60px;
  padding: 0 32px;

  a {
    align-items: center;
    display: flex;
    justify-content: center;
    text-decoration: none;
  }

  h1 {
    color: ${NEUTRAL.N700};
    font-size: 14px;
    font-weight: 600;
  }

  img {
    height: 26px;
    margin-right: 10px;
  }

  .right-section {
    display: flex;
    gap: 16px;
  }

  .menu-button {
    width: 40px;
  }

  ${media.phone`
      padding: 0 20px;
  `}
`;

const HourlyUsageSurveyAppBar = ({ step }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useContext(HourlySurveyDispatch);
  const { t } = useTranslation();

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
    <Wrapper>
      <Typography variant="h1">
        {
          step === 0
            ? t(TranslationKeys.TITLE)
            : t(TranslationKeys.STEP_TITLE, { step })
        }
      </Typography>
      <div className="right-section">
        {
          step !== 0 && (
            <IconButton
                aria-controls="app_bar_menu"
                aria-haspopup="true"
                className="menu-button"
                onClick={handleOnClick}>
              <EllipsisVerticalIcon size={16} />
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
            {t(TranslationKeys.INSTRUCTIONS)}
          </MenuItem>
        </Menu>
      </div>
    </Wrapper>
  );
};

export default HourlyUsageSurveyAppBar;
