// @flow

import { useEffect, useState } from 'react';

import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  Spinner,
  Typography
} from 'lattice-ui-kit';
import { ReduxConstants, ReduxUtils, useRequestState } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import SearchPanel from './components/SearchPanel';
import SummaryHeader from './components/SummaryHeader';
import SummaryListComponent from './components/SummaryListComponent';
import {
  DOWNLOAD_ALL_TUD_DATA,
  DOWNLOAD_DAILY_TUD_DATA,
  downloadAllTudData,
  downloadDailyTudData,
} from './TimeUseDiaryActions';
import { GET_TUD_SUBMISSIONS_BY_DATE_RANGE, getTimeUseDiarySubmissionsByDateRange } from './actions';
import type { DataType } from './constants/DataTypes';

import { BasicErrorComponent } from '../../common/components';
import {
  END_DATE,
  START_DATE,
  STUDY_ID,
  TIME_USE_DIARY,
} from '../../common/constants';
import { resetRequestStates } from '../../core/redux/actions';
import { selectTimeUseDiarySubmissions } from '../../core/redux/selectors';
import type { Study } from '../../common/types';

const { REQUEST_STATE } = ReduxConstants;

const {
  isFailure,
  isPending,
  isStandby,
  isSuccess,
} = ReduxUtils;

const TimeUseDiaryDashboard = ({
  study,
} :{
  study :Study;
}) => {

  const dispatch = useDispatch();

  const [dates, setDates] = useState({
    startDate: undefined,
    endDate: undefined
  });

  // selectors
  const downloadAllDataRS :?RequestState = useRequestState(['tud', DOWNLOAD_ALL_TUD_DATA]);
  const downloadStates = useSelector((state) => state.getIn(['tud', DOWNLOAD_DAILY_TUD_DATA, REQUEST_STATE], Map()));
  const getSubmissionsRS :?RequestState = useRequestState([TIME_USE_DIARY, GET_TUD_SUBMISSIONS_BY_DATE_RANGE]);
  const timeUseDiarySubmissions = useSelector(selectTimeUseDiarySubmissions());

  // reset state on dismount
  useEffect(() => () => {
    dispatch(resetRequestStates([GET_TUD_SUBMISSIONS_BY_DATE_RANGE]));
  }, [dispatch]);

  const onSetDate = (name :string, value :string) => {
    setDates({
      ...dates,
      [name]: value,
    });
  };

  const handleOnGetSubmissions = () => {
    const { startDate, endDate } = dates;

    if (startDate && endDate) {
      dispatch(
        getTimeUseDiarySubmissionsByDateRange({
          [END_DATE]: endDate,
          [START_DATE]: startDate,
          [STUDY_ID]: study.id,
        })
      );
    }
  };

  const handleDownload = (entities :?List, date :?string, dataType :DataType) => {
    const { endDate, startDate } = dates;

    if (!date) {
      // download all
      dispatch(downloadAllTudData({
        entities: timeUseDiarySubmissions.toList().flatten(true),
        dataType,
        endDate,
        startDate
      }));
    }
    else {
      dispatch(downloadDailyTudData({
        dataType,
        date,
        endDate,
        entities,
        startDate,
      }));
    }
  };

  const errorMsg = 'An error occurred while loading time use diary data.'
    + ' Please try reloading the page or contact support if the issue persists';

  return (
    <Card>
      <CardSegment>
        <SearchPanel
            endDate={dates.endDate}
            getSubmissionsRS={getSubmissionsRS}
            onGetSubmissions={handleOnGetSubmissions}
            onSetDate={onSetDate}
            startDate={dates.startDate} />
      </CardSegment>

      {
        !isStandby(getSubmissionsRS) && (
          <CardSegment>
            {
              isPending(getSubmissionsRS) && (
                <Spinner size="2x" />
              )
            }
            {
              isFailure(getSubmissionsRS) && (
                <BasicErrorComponent>
                  <Typography variant="body2">
                    { errorMsg }
                  </Typography>
                </BasicErrorComponent>
              )
            }
            {
              isSuccess(getSubmissionsRS) && (
                <>
                  {
                    timeUseDiarySubmissions.isEmpty() ? (
                      <Typography>
                        No submissions found for the selected date range.
                      </Typography>
                    ) : (
                      <>
                        <SummaryHeader
                            onDownloadData={handleDownload}
                            downloadAllDataRS={downloadAllDataRS} />
                        <div>
                          {
                            timeUseDiarySubmissions.entrySeq().map(([key, submissionIds]) => (
                              <SummaryListComponent
                                  date={key}
                                  downloadRS={downloadStates.get(key, Map())}
                                  key={key}
                                  onDownloadData={handleDownload}
                                  submissionIds={submissionIds}>
                                {key}
                              </SummaryListComponent>
                            ))
                          }
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
          </CardSegment>
        )
      }
    </Card>
  );
};

export default TimeUseDiaryDashboard;
