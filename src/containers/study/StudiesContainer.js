/*
 * @flow
 */

import { useState } from 'react';

import {
  Box,
  Button,
  Grid,
  Spinner,
  Typography,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import StudyCard from './components/StudyCard';
import StudyDetailsModal from './components/StudyDetailsModal';
import { CREATE_STUDY, GET_ORG_STUDIES } from './actions';

import { BasicErrorComponent } from '../../common/components';
import { STUDIES } from '../../common/constants';
import { useRequestState } from '../../common/utils';
import { resetRequestStates } from '../../core/redux/actions';
import { selectStudies } from '../../core/redux/selectors';

const StudiesContainer = () => {

  const dispatch = useDispatch();
  const [createStudyModalVisible, setCreateStudyModalVisible] = useState(false);

  const getStudiesRS :?RequestState = useRequestState([STUDIES, GET_ORG_STUDIES]);

  const studies = useSelector(selectStudies());

  const openCreateStudyModal = () => {
    // necessary after a successful or failed CREATE_STUDY action
    dispatch(resetRequestStates([CREATE_STUDY]));
    setCreateStudyModalVisible(true);
  };

  if (getStudiesRS === RequestStates.PENDING) {
    return (
      <Spinner size="2x" />
    );
  }

  if (getStudiesRS === RequestStates.FAILURE) {
    return (
      <BasicErrorComponent />
    );
  }

  return (
    <>
      <Box mb={2}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box fontWeight="fontWeightNormal" fontSize={28}>
              Studies
            </Box>
          </Grid>
          <Grid container item xs={6} justify="flex-end">
            <Button color="primary" onClick={openCreateStudyModal}> Create Study </Button>
          </Grid>
        </Grid>
      </Box>
      {
        studies.isEmpty()
          ? (
            <Typography variant="body2" align="center">
              Sorry, no studies were found. Please try refreshing the page, or contact support.
            </Typography>
          )
          : (
            <Grid container spacing={3}>
              {
                studies.valueSeq().map((study) => (
                  <Grid item xs={12} sm={6} key={study.id}>
                    <StudyCard study={study} />
                  </Grid>
                ))
              }
            </Grid>
          )
      }
      <StudyDetailsModal
          handleOnCloseModal={() => setCreateStudyModalVisible(false)}
          isVisible={createStudyModalVisible} />
    </>
  );
};

export default StudiesContainer;
