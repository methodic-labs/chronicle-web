/*
 * @flow
 */

import React, { useEffect, useMemo, useReducer, useState } from 'react';

import qs from 'qs';
import styled from 'styled-components';
import { Form } from 'lattice-fabricate';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  Card,
  CardSegment,
  Grid,
  Typography,
} from 'lattice-ui-kit';
import { DateTime, Interval } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { GET_DEVICE_USAGE_SURVEY_DATA, getDeviceUsageSurveyData } from './actions';
import { generateHourBlocks, generateSchema } from './utils';

import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import {
  DEVICE_USAGE_SURVEY,
} from '../../common/constants';
import {
  isFailure,
  isPending,
  isStandby,
  isSuccess,
  useRequestState,
} from '../../common/utils';

const IntroCardSegment = styled(CardSegment)`
  bottom: -16px;
  padding: 14px 0 30px 0;
  position: relative;
`;

const DeviceUsageSurveyContainer = () => {

  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams :any = qs.parse(location.search, { ignoreQueryPrefix: true });
  console.log(queryParams);
  const {
    from, // YYYY-MM-DD
    to,
    participantId,
    studyId,
  } :{
    from ?:string;
    to ?:string;
    participantId :string;
    studyId :UUID;
  } = queryParams;

  let dateFrom = from ? DateTime.fromFormat(from, 'yyyy-MM-dd') : DateTime.local();
  const isValidDateFrom = dateFrom.isValid;
  let dateTo = to ? DateTime.fromISO(to) : dateFrom;
  const isValidDateTo = dateTo.isValid;

  // a day starts at 7pm before the "from" date and ends at 7pm on the "to" date
  dateFrom = dateFrom.minus({ hours: 5 });
  dateTo = dateTo.plus({ hours: 19 });
  console.log('DATE FROM: ', dateFrom.toISO());
  console.log('DATE TO  : ', dateTo.toISO());
  // $FlowIgnore
  if (dateFrom > dateTo) {
    const temp = dateFrom;
    dateFrom = dateTo;
    dateTo = temp;
  }

  const intervals = Interval.fromDateTimes(dateFrom, dateTo).splitBy({ hours: 3 });
  const { dataSchema, uiSchema } = generateSchema(intervals);

  useEffect(() => {
    dispatch(
      getDeviceUsageSurveyData({
        dateFrom,
        dateTo,
        intervals,
        participantId,
        studyId,
      })
    );
  }, [
    dateFrom,
    dateTo,
    dispatch,
    intervals,
    participantId,
    studyId,
  ]);
  const onSubmit = () => {
    console.log('DeviceUsageSurveyContainer - onSubmit');
  };

  return (
    <AppContainerWrapper>
      <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
      <AppContentWrapper>
        {
          !isValidDateFrom && (
            <Typography>
              {'The "from" date is incorrectly formatted: '}
              {from}
            </Typography>
          )
        }
        {
          !isValidDateTo && (
            <Typography>
              {'The "to" date is incorrectly formatted: '}
              {from}
            </Typography>
          )
        }
        {
          isValidDateFrom && isValidDateTo && (
            <Grid container direction="column" spacing={3} wrap="nowrap">
              <Grid item>
                <Typography gutterBottom variant="h3">Device Usage Survey</Typography>
                <Typography>
                  { dateFrom.toLocaleString(DateTime.DATETIME_MED) }
                  { ' - ' }
                  { dateTo.toLocaleString(DateTime.DATETIME_MED) }
                </Typography>
              </Grid>
              <Grid item>
                <Card>
                  <IntroCardSegment noBleed>
                    <Typography>
                      Thank you for taking the time to complete this survey! Below, you will find ...
                    </Typography>
                  </IntroCardSegment>
                  <Form
                      isSubmitting={false}
                      onSubmit={onSubmit}
                      schema={dataSchema}
                      uiSchema={uiSchema} />
                </Card>
              </Grid>
            </Grid>
          )
        }
      </AppContentWrapper>
    </AppContainerWrapper>
  );
};

export default DeviceUsageSurveyContainer;
