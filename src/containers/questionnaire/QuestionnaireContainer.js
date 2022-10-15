// @flow

import {
  AppContainerWrapper,
  AppContentWrapper,
  AppHeaderWrapper,
  Typography,
} from 'lattice-ui-kit';

import { OpenLatticeIconSVG } from '../../assets/svg/icons';
import { BasicErrorComponent } from '../../common/components';

const QuestionnaireContainer = () => (
  <AppContainerWrapper>
    <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
    <AppContentWrapper>
      <BasicErrorComponent>
        <Typography component="span">
          Sorry, this feature is not enabled. Please contact support for more information.
        </Typography>
      </BasicErrorComponent>
    </AppContentWrapper>
  </AppContainerWrapper>
);

// const QuestionnaireContainer = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//
//   const questionnaire = useSelector((state) => state.getIn(['questionnaire', QUESTIONNAIRE_DATA], Map()));
//   const requestStates = useSelector((state) => ({
//     [GET_QUESTIONNAIRE]: state.getIn(['questionnaire', GET_QUESTIONNAIRE, REQUEST_STATE]),
//     [SUBMIT_QUESTIONNAIRE]: state.getIn(['questionnaire', SUBMIT_QUESTIONNAIRE, REQUEST_STATE])
//   }));
//
//   const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
//   const {
//     organizationId,
//     participantId,
//     questionnaireId,
//     studyId
//   } :{
//     organizationId :UUID,
//     participantId :UUID,
//     questionnaireId :UUID,
//     studyId :UUID
//     // $FlowFixMe
//   } = queryParams;
//
//   useEffect(() => {
//     dispatch(getQuestionnaire({ organizationId, studyId, questionnaireId }));
//   }, [dispatch, questionnaireId, studyId, organizationId]);
//
//   const questionnaireDetails = questionnaire.get('questionnaireDetails', Map());
//
//   return (
//     <AppContainerWrapper>
//       <AppHeaderWrapper appIcon={OpenLatticeIconSVG} appTitle="Chronicle" />
//       <AppContentWrapper>
//         {
//           requestStates[GET_QUESTIONNAIRE] === RequestStates.PENDING && (
//             <div style={{ marginTop: '60px', textAlign: 'center' }}>
//               <Spinner size="2x" />
//             </div>
//           )
//         }
//         {
//           requestStates[GET_QUESTIONNAIRE] === RequestStates.FAILURE && <BasicErrorComponent />
//         }
//         {
//           requestStates[SUBMIT_QUESTIONNAIRE] === RequestStates.FAILURE && (
//             <SubmissionStatus />
//           )
//         }
//         {
//           requestStates[SUBMIT_QUESTIONNAIRE] === RequestStates.SUCCESS && (
//             <SubmissionStatus success />
//           )
//         }
//         {
//           requestStates[GET_QUESTIONNAIRE] === RequestStates.SUCCESS
//           && requestStates[SUBMIT_QUESTIONNAIRE] !== RequestStates.SUCCESS
//           && (
//             <>
//               <Title>
//                 { questionnaireDetails.getIn([NAME_FQN, 0]) }
//               </Title>
//               <Description>
//                 { questionnaireDetails.getIn([DESCRIPTION_FQN, 0]) }
//               </Description>
//               <QuestionnaireForm
//                   organizationId={organizationId}
//                   participantId={participantId}
//                   questions={questionnaire.get('questions', List())}
//                   studyId={studyId}
//                   submitRequestState={requestStates[SUBMIT_QUESTIONNAIRE]} />
//             </>
//           )
//         }
//       </AppContentWrapper>
//     </AppContainerWrapper>
//   );
// };

export default QuestionnaireContainer;
