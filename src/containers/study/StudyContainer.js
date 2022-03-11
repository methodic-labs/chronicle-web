/*
 * @flow
 */

import { useEffect, useState } from 'react';

import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Set } from 'immutable';
import {
  Box,
  Card,
  CardSegment,
  Colors,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from 'lattice-ui-kit';
import { useBoolean, useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { DELETE_STUDY, UPDATE_STUDY, removeStudyOnDelete } from './actions';
import { DeleteStudyModal, StudyDetails, StudyDetailsModal } from './components';

import { resetRequestStates } from '../../core/redux/actions';
import { selectMyKeys } from '../../core/redux/selectors';
import type { Study, UUID } from '../../common/types';

const { NEUTRAL } = Colors;

const StudyDetailsItem = ({
  label,
  missingValue,
  placeholder,
  value,
} :{
  label :string;
  missingValue ?:boolean;
  placeholder ?:string;
  value :string;
}) => {

  const detailValue = missingValue ? placeholder : value;

  return (
    <Box mb={2}>
      <Typography variant="h5">
        { label }
      </Typography>
      {
        missingValue ? (
          <Box fontStyle="italic">
            <Typography color="textSecondary">
              { detailValue }
            </Typography>
          </Box>
        ) : (
          <Typography>
            { detailValue }
          </Typography>
        )
      }
    </Box>
  );
};

StudyDetailsItem.defaultProps = {
  placeholder: undefined,
  missingValue: false
};

const StudyContainer = ({
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasTimeUseDiary,
  study,
} :{
  hasAndroidDataCollection :boolean;
  hasIOSSensorDataCollection :boolean;
  hasTimeUseDiary :boolean;
  study :Study;
}) => {

  const dispatch = useDispatch();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalVisible, showDeleteModal, hideDeleteModal] = useBoolean(false);

  const deleteStudyRS = useRequestState(['studies', DELETE_STUDY]);

  const myKeys :Set<List<UUID>> = useSelector(selectMyKeys());
  const isOwner :boolean = myKeys.has(List([study.id]));

  // After deleting study, redirect to root
  useEffect(() => {
    if (deleteStudyRS === RequestStates.SUCCESS) {
      setTimeout(() => {
        dispatch(removeStudyOnDelete(study.id));
        dispatch(resetRequestStates([DELETE_STUDY]));
      }, 2000);
    }
  }, [deleteStudyRS, dispatch, study]);

  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const onCloseDeleteModal = () => {
    hideDeleteModal();
    dispatch(resetRequestStates([DELETE_STUDY]));
  };

  const openEditModal = () => {
    dispatch(resetRequestStates([UPDATE_STUDY]));
    setEditModalVisible(true);
    setAnchorEl(null);
  };

  const onShowDeleteModal = () => {
    showDeleteModal();
    setAnchorEl(null);
  };

  return (
    <Card>
      <CardSegment>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <StudyDetails
              hasAndroidDataCollection={hasAndroidDataCollection}
              hasIOSSensorDataCollection={hasIOSSensorDataCollection}
              hasTimeUseDiary={hasTimeUseDiary}
              study={study} />
          <IconButton
              aria-controls="actions_menu"
              onClick={handleOnClick}>
            <FontAwesomeIcon
                color={NEUTRAL.N800}
                icon={faEllipsisV} />
          </IconButton>
          <Menu
              id="actions_menu"
              anchorEl={anchorEl}
              aria-haspopup="true"
              keepMounted
              open={Boolean(anchorEl)}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
              getContentAnchorEl={null}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              onClose={() => setAnchorEl(null)}>
            <MenuItem
                onClick={openEditModal}>
              Edit Details
            </MenuItem>
            <MenuItem
                disabled={!isOwner}
                onClick={onShowDeleteModal}>
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </CardSegment>
      <StudyDetailsModal
          handleOnCloseModal={closeEditModal}
          isVisible={editModalVisible}
          study={study} />
      <DeleteStudyModal
          isVisible={isDeleteModalVisible}
          onClose={onCloseDeleteModal}
          requestState={deleteStudyRS || RequestStates.STANDBY}
          study={study} />
    </Card>
  );
};
export default StudyContainer;
