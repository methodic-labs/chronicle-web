// @flow

import { Map } from 'immutable';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  Box,
  Spinner
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import SubmissionSuccessful from './components/SubmissionSuccessful';
import SurveyForm from './components/SurveyForm';

import BasicErrorComponent from '../shared/BasicErrorComponent';
import { OpenLatticeIconSVG } from '../../assets/svg/icons';

const { isPending } = ReduxUtils;

type Props = {
  data :Map;
  date :string;
  submitSurveyRS :?RequestState;
  getappUsageSurveyDataRS :?RequestState;
  participantId :string;
  studyId :UUID ;
}

const SurveyContainer = (props :Props) => {
  const {
    data,
    date,
    studyId,
    participantId,
    getappUsageSurveyDataRS,
    submitSurveyRS,
  } = props;

  if (isPending(getappUsageSurveyDataRS)) {
    return (
      <Box mt="60px" textAlign="center">
        <Spinner size="2x" />
      </Box>
    );
  }

  return (
    <AppContainerWrapper>
      <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
      <AppContentWrapper>
        {
          getappUsageSurveyDataRS === RequestStates.FAILURE && <BasicErrorComponent />
        }
        {
          getappUsageSurveyDataRS === RequestStates.SUCCESS && (
            <>
              {
                submitSurveyRS === RequestStates.SUCCESS
                  ? <SubmissionSuccessful />
                  : (
                    <>
                      <Box fontSize="20px" fontWeight={400}>
                        Apps Usage Survey
                      </Box>
                      <Box fontSize="16px" fontWeight={400} mt="5px" mb="20px">
                        { DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL) }
                      </Box>
                      <SurveyForm
                          participantId={participantId}
                          studyId={studyId}
                          submitSurveyRS={submitSurveyRS}
                          userAppsData={data} />
                    </>
                  )
              }
            </>
          )
        }
      </AppContentWrapper>
    </AppContainerWrapper>
  );
};

export default SurveyContainer;
