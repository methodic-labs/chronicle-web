// @flow
import { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ReduxUtils, useRequestState } from 'lattice-utils';
import { useDispatch } from 'react-redux';

import StudiesTable from './components/StudiesTable';
import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData } from './actions';

import { resetRequestState } from '../../core/redux/ReduxActions';
import { REDUCERS } from '../../utils/constants/ReduxConstants';

const { isPending } = ReduxUtils;

const AllStudiesContainer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStudiesTableData());

    return () => {
      dispatch(resetRequestState(GET_ALL_STUDIES_TABLE_DATA));
    };
  });

  const getAllStudiesTableDataRS = useRequestState([REDUCERS.DASHBOARD, GET_ALL_STUDIES_TABLE_DATA]);

  if (isPending(getAllStudiesTableDataRS)) {
    return (
      <Spinner size="2x" />
    );
  }

  return <StudiesTable />;
};

export default AllStudiesContainer;
