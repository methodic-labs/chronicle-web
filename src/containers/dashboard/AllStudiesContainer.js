// @flow

import { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import StudiesTable from './components/StudiesTable';
import selectAllStudiesTableData from './selectors/selectAllStudiesTableData';
import { GET_ALL_STUDIES_TABLE_DATA, getAllStudiesTableData } from './actions';

import { DASHBOARD } from '../../common/constants';
import { isPending, isStandby, useRequestState } from '../../common/utils';
import { resetRequestState } from '../../core/redux/ReduxActions';

const AllStudiesContainer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStudiesTableData());

    return () => {
      dispatch(resetRequestState(GET_ALL_STUDIES_TABLE_DATA));
    };
  }, [dispatch]);

  const data = useSelector(selectAllStudiesTableData());

  const getAllStudiesTableDataRS = useRequestState([DASHBOARD, GET_ALL_STUDIES_TABLE_DATA]);

  if (isPending(getAllStudiesTableDataRS) || isStandby(getAllStudiesTableDataRS)) {
    return (
      <Spinner size="2x" />
    );
  }

  return <StudiesTable data={data.toJS()} />;
};

export default AllStudiesContainer;
