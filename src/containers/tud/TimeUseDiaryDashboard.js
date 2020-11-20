// @flow

import React, { useState, useEffect } from 'react';

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
import { resetRequestState } from '../../core/redux/ReduxActions';

import {
  DOWNLOAD_TUD_RESPONSES,
  GET_SUBMISSIONS_BY_DATE,
  downloadTudResponses,
  getSubmissionsByDate
} from './TimeUseDiaryActions';

import BasicErrorComponent from '../shared/BasicErrorComponent';
import { TUD_REDUX_CONSTANTS } from '../../utils/constants/ReduxConstants';

const { SUBMISSIONS_BY_DATE } = TUD_REDUX_CONSTANTS;

const { REQUEST_STATE } = ReduxConstants;

const {
  isFailure,
  isPending,
  isStandby,
  isSuccess,
} = ReduxUtils;

type Props = {
  studyEKID :?UUID;
  studyId :UUID;
};

const TimeUseDiaryDashboard = ({ studyEKID, studyId } :Props) => {
  const dispatch = useDispatch();

  const [dates, setDates] = useState({
    startDate: undefined,
    endDate: undefined
  });

  // selectors
  const getSubmissionsByDateRS :?RequestState = useRequestState(['tud', GET_SUBMISSIONS_BY_DATE]);
  const submissionsByDate = useSelector((state) => state.getIn(['tud', SUBMISSIONS_BY_DATE], Map()));
  const downloadStates = useSelector((state) => state.getIn(['tud', DOWNLOAD_TUD_RESPONSES, REQUEST_STATE], Map()));

  // reset state on dismount
  useEffect(() => () => {
    dispatch(resetRequestState(GET_SUBMISSIONS_BY_DATE));
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
      dispatch(getSubmissionsByDate({
        endDate,
        startDate,
        studyEKID,
        studyId
      }));
    }
  };

  const handleDownload = (entities :List, date :string) => {
    dispatch(downloadTudResponses({
      entities,
      date
    }));
  };

  const errorMsg = 'An error occurred while loading time use diary data.'
    + ' Please try reloading the page or contact support if the issue persists';

  return (
    <Card>
      <CardSegment>
        <SearchPanel
            endDate={dates.endDate}
            getSubmissionsRS={getSubmissionsByDateRS}
            onGetSubmissions={handleOnGetSubmissions}
            onSetDate={onSetDate}
            startDate={dates.startDate} />
      </CardSegment>

      {
        !isStandby(getSubmissionsByDateRS) && (
          <CardSegment>
            {
              isPending(getSubmissionsByDateRS) && (
                <Spinner size="2x" />
              )
            }
            {
              isFailure(getSubmissionsByDateRS) && (
                <BasicErrorComponent>
                  <Typography variant="body2">
                    { errorMsg }
                  </Typography>
                </BasicErrorComponent>
              )
            }
            {
              isSuccess(getSubmissionsByDateRS) && (
                <>
                  {
                    submissionsByDate.isEmpty() ? (
                      <Typography>
                        No submissions found for the selected date range.
                      </Typography>
                    ) : (
                      <>
                        <SummaryHeader />
                        <div>
                          {
                            submissionsByDate.entrySeq().map(([key, entities]) => (
                              <SummaryListComponent
                                  key={key}
                                  date={key}
                                  entities={entities}
                                  downloadRS={downloadStates.get(key)}
                                  onDownloadData={handleDownload}>
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
