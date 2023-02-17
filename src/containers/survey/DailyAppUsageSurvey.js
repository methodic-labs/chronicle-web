// @flow

import { Map } from 'immutable';
import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  Box,
  Spinner
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import SubmissionSuccessful from './components/SubmissionSuccessful';
import SurveyForm from './components/SurveyForm';

import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import { isPending } from '../../common/utils';

type Props = {
  data :Map;
  date :string;
  submitSurveyRS :?RequestState;
  getAppUsageSurveyDataRS :?RequestState;
  participantId :string;
  studyId :UUID ;
}

const SurveyContainer = (props :Props) => {
  const {
    data,
    date,
    studyId,
    participantId,
    getAppUsageSurveyDataRS,
    submitSurveyRS,
  } = props;

  if (isPending(getAppUsageSurveyDataRS)) {
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
          getAppUsageSurveyDataRS === RequestStates.SUCCESS && (
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
