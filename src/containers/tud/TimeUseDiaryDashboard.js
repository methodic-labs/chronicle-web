import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card,
  CardSegment,
  Spinner,
  Typography
} from '../../lattice-ui-kit';
import SearchPanel from './components/SearchPanel';
import SummaryHeader from './components/SummaryHeader';
import SummaryListComponent from './components/SummaryListComponent';
import getTimeUseDiaryDataDownloadUrl from './utils/getTimeUseDiaryDataDownloadUrl';
import {
  GET_TUD_SUBMISSIONS_BY_DATE_RANGE,
  getTimeUseDiarySubmissionsByDateRange,
} from './actions';
import { BasicErrorComponent } from '../../common/components';
import {
  END_DATE,
  START_DATE,
  STUDY_ID,
  TIME_USE_DIARY,
} from '../../common/constants';
import {
  formatAsDate,
  isFailure,
  isPending,
  isStandby,
  isSuccess,
  useRequestState,
} from '../../common/utils';
import { resetRequestStates } from '../../core/redux/actions';
import { selectTimeUseDiarySubmissions } from '../../core/redux/selectors';

const TimeUseDiaryDashboard = ({
  study,
}) => {

  const dispatch = useDispatch();

  const [dates, setDates] = useState({
    selectedStartDate: undefined,
    selectedEndDate: undefined
  });

  // selectors
  const getSubmissionsRS = useRequestState([TIME_USE_DIARY, GET_TUD_SUBMISSIONS_BY_DATE_RANGE]);
  const timeUseDiarySubmissions = useSelector(selectTimeUseDiarySubmissions());

  // reset state on dismount
  useEffect(() => () => {
    dispatch(resetRequestStates([GET_TUD_SUBMISSIONS_BY_DATE_RANGE]));
  }, [dispatch]);

  const onSetDate = (name, value) => {
    setDates({
      ...dates,
      [name]: value,
    });
  };

  const handleOnGetSubmissions = () => {
    const { selectedStartDate, selectedEndDate } = dates;

    if (selectedStartDate && selectedEndDate) {
      dispatch(
        getTimeUseDiarySubmissionsByDateRange({
          [START_DATE]: selectedStartDate,
          [END_DATE]: selectedEndDate,
          [STUDY_ID]: study.id,
        })
      );
    }
  };

  const handleDownload = (date, dataType) => {
    const { selectedStartDate, selectedEndDate } = dates;

    // $FlowFixMe
    const startDate = date || DateTime.fromISO(selectedStartDate);
    // $FlowFixMe
    const endDate = date || DateTime.fromISO(selectedEndDate);

    const url = getTimeUseDiaryDataDownloadUrl(
      study.id,
      startDate.startOf('day'),
      endDate.endOf('day'),
      dataType,
    );

    window.open(url, '_blank');
  };

  const errorMsg = 'An error occurred while loading time use diary data.'
    + ' Please try reloading the page or contact support if the issue persists';

  return (
    <Card>
      <CardSegment>
        <SearchPanel
            endDate={dates.selectedEndDate}
            getSubmissionsRS={getSubmissionsRS}
            onGetSubmissions={handleOnGetSubmissions}
            onSetDate={onSetDate}
            startDate={dates.selectedStartDate} />
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
                        <SummaryHeader onDownloadData={handleDownload} />
                        <div>
                          {
                            timeUseDiarySubmissions
                              .entrySeq().map(([key, submissionIds]) => (
                                <SummaryListComponent
                                    key={formatAsDate(key)}
                                    date={key}
                                    onDownloadData={handleDownload}
                                    submissionIds={submissionIds} />
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
