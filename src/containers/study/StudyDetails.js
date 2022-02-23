/*
 * @flow
 */

import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { faBell, faBellSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Set } from 'immutable';
import {
  Box,
  Button,
  Card,
  CardSegment,
  Colors,
  Grid,
  Typography
} from 'lattice-ui-kit';
import { LangUtils, useBoolean, useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import DeleteStudyModal from './components/DeleteStudyModal';

import StudyDetailsModal from '../studies/components/StudyDetailsModal';
import { resetRequestState } from '../../core/redux/ReduxActions';
import { selectMyKeys } from '../../core/redux/selectors';
import { DELETE_STUDY, UPDATE_STUDY, removeStudyOnDelete } from '../studies/StudiesActions';
import type { Study, UUID } from '../../common/types';

const { isNonEmptyString } = LangUtils;

const { NEUTRAL, GREEN } = Colors;

const StyledFontAwesome = styled(FontAwesomeIcon)`
  font-size: 22px;
`;

type StudyDetailsItemProps = {
  label :string;
  missingValue?:boolean;
  placeholder?:string;
  value :string;
}

const StudyDetailsItem = ({
  label,
  missingValue,
  placeholder,
  value,
} :StudyDetailsItemProps) => {
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

const StudyDetails = ({
  study,
} :{
  study :Study;
}) => {

  const dispatch = useDispatch();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, showDeleteModal, hideDeleteModal] = useBoolean(false);

  const deleteStudyRS = useRequestState(['studies', DELETE_STUDY]);

  const myKeys :Set<List<UUID>> = useSelector(selectMyKeys());
  const isOwner :boolean = myKeys.has(List([study.id]));

  const notificationIcon = study.notificationsEnabled ? faBell : faBellSlash;

  // After deleting study, redirect to root
  useEffect(() => {
    if (deleteStudyRS === RequestStates.SUCCESS) {
      setTimeout(() => {
        dispatch(removeStudyOnDelete(study.id));
        dispatch(resetRequestState(DELETE_STUDY));
      }, 2000);
    }
  }, [deleteStudyRS, dispatch, study]);

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const onCloseDeleteModal = () => {
    hideDeleteModal();
    dispatch(resetRequestState(DELETE_STUDY));
  };

  const openEditModal = () => {
    // clear any previous state
    dispatch(resetRequestState(UPDATE_STUDY));

    setEditModalVisible(true);
  };

  const DetailsHeader = () => (
    <Box display="flex" alignItems="center">
      <StyledFontAwesome icon={notificationIcon} color={study.notificationsEnabled ? GREEN.G300 : NEUTRAL.N300} />
      <Box ml={1}>
        <Typography color="textSecondary" variant="button"> Daily Notifications </Typography>
      </Box>
    </Box>
  );

  return (
    <Card>
      <CardSegment>
        <DetailsHeader />
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StudyDetailsItem
                  label="Description"
                  missingValue={!isNonEmptyString(study.description)}
                  placeholder="No description"
                  value={study.description} />
              <StudyDetailsItem
                  label="UUID"
                  value={study.id} />
              <StudyDetailsItem
                  label="Version"
                  missingValue={!isNonEmptyString(study.version)}
                  placeholder="No version"
                  value={study.version} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StudyDetailsItem
                  label="Email"
                  value={study.contact} />
              <StudyDetailsItem
                  label="Group"
                  missingValue={!isNonEmptyString(study.group)}
                  placeholder="No group"
                  value={study.group} />
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <Button
                    color="secondary"
                    fullWidth
                    onClick={openEditModal}>
                  Edit Details
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                    color="error"
                    disabled={!isOwner}
                    fullWidth
                    onClick={showDeleteModal}>
                  Delete Study
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <StudyDetailsModal
              handleOnCloseModal={closeEditModal}
              isVisible={editModalVisible}
              study={study} />
          <DeleteStudyModal
              isVisible={isDeleteModalVisible}
              onClose={onCloseDeleteModal}
              requestState={deleteStudyRS || RequestStates.STANDBY}
              study={study} />
        </Box>
      </CardSegment>
    </Card>
  );
};
export default StudyDetails;
