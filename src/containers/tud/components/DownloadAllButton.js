// @flow

import { useState } from 'react';

import { Button, Menu, MenuItem } from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import DataTypes from '../constants/DataTypes';
import type { DataType } from '../constants/DataTypes';

// actions
const DOWNLOAD_DATA = 'downloadData';
const TOGGLE_MENU = 'toggleMenu';

type Props = {
  onDownloadData :(date :?DateTime, dataType :DataType) => void;
  isLoading :boolean
}
const DownloadAllButton = ({ isLoading, onDownloadData } :Props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    const { currentTarget } = event;
    const { dataset } = currentTarget;
    const { actionId, typeId } = dataset;

    switch (actionId) {
      case TOGGLE_MENU:
        setAnchorEl(currentTarget);
        break;
      case DOWNLOAD_DATA:
        handleClose();
        onDownloadData(undefined, typeId);
        break;
      default:
    }
  };

  return (
    <div>
      <Button
          aria-controls="menu"
          aria-haspopup="true"
          color="primary"
          data-action-id={TOGGLE_MENU}
          isLoading={isLoading}
          onClick={handleClick}
          size="small">
        Download All
      </Button>
      <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
        <MenuItem
            data-action-id={DOWNLOAD_DATA}
            data-type-id={DataTypes.DAYTIME}
            onClick={handleClick}>
          Daytime
        </MenuItem>
        <MenuItem
            data-action-id={DOWNLOAD_DATA}
            data-type-id={DataTypes.NIGHTTIME}
            onClick={handleClick}>
          Nighttime
        </MenuItem>

        <MenuItem
            disabled
            data-action-id={DOWNLOAD_DATA}
            data-type-id={DataTypes.SUMMARIZED}
            onClick={handleClick}>
          Summarized
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DownloadAllButton;
