// @flow

import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import isEqual from 'lodash/isEqual';
import qs from 'qs';
import { Paged } from 'lattice-fabricate';
import {
  AppContainerWrapper,
  AppContentWrapper,
  Box,
  Card,
  CardSegment,
  Spinner,
  Typography,
} from 'lattice-ui-kit';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import ConfirmChangeLanguage from './components/ConfirmChangeLanguage';
import HeaderComponent from './components/HeaderComponent';
import ProgressBar from './components/ProgressBar';
import QuestionnaireForm from './components/QuestionnaireForm';
import SUPPORTED_LANGUAGES from './constants/SupportedLanguages';
import SubmissionErrorModal from './components/SubmissionErrorModal';
import SubmissionSuccessful from './components/SubmissionSuccessful';
import TranslationKeys from './constants/TranslationKeys';
import { SUBMIT_TIME_USE_DIARY } from './actions';
import { PAGE_NUMBERS } from './constants/GeneralConstants';
import { PROPERTY_CONSTS } from './constants/SchemaConstants';
import { usePrevious } from './hooks';
import {
  createFormSchema,
  getIs12HourFormatSelected,
  getIsNightActivityPage,
  getIsSummaryPage,
  selectTimeByPageAndKey
} from './utils';

import { BasicErrorComponent } from '../../common/components';
import {
  DEFAULT_LANGUAGE,
  LanguageCodes,
  PARTICIPANT_ID,
  STUDIES,
  STUDY_ID,
  TIME_USE_DIARY,
  TODAY,
  YESTERDAY,
} from '../../common/constants';
import { isFailure, isPending, useRequestState } from '../../common/utils';
import { selectStudySettings } from '../../core/redux/selectors';
import {
  GET_STUDY_SETTINGS,
  VERIFY_PARTICIPANT,
  getStudySettings,
  verifyParticipant,
} from '../study/actions';

const {
  ACTIVITY_END_TIME,
  DAY_END_TIME,
  DAY_START_TIME
} = PROPERTY_CONSTS;

const { DAY_SPAN_PAGE, SURVEY_INTRO_PAGE } = PAGE_NUMBERS;

const TimeUseDiaryContainer = () => {
  const location = useLocation();
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const {
    day,
    familyId,
    organizationId,
    participantId,
    studyId,
    waveId,
  } :{
    day :String;
    familyId :string;
    organizationId :UUID;
    participantId :string;
    studyId :UUID;
    waveId :string;
    // $FlowFixMe
  } = queryParams;

  const dispatch = useDispatch();

  const { i18n, t } = useTranslation();

  const studySettings = useSelector(selectStudySettings(studyId));

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({});

  const [currentTime, setCurrentTime] = useState();
  const [dayEndTime, setDayEndTime] = useState();
  const [dayStartTime, setDayStartTime] = useState();
  const [isSummaryPage, setIsSummaryPage] = useState(false);
  const [isNightActivityPage, setIsNightActivityPage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageToChangeTo, setLanguageToChangeTo] = useState(null);
  const [isChangeLanguageModalVisible, setChangeLanguageModalVisible] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  // selectors
  const submitTimeUseDiaryRS :?RequestState = useRequestState([TIME_USE_DIARY, SUBMIT_TIME_USE_DIARY]);
  const verifyParticipantRS :?RequestState = useRequestState([STUDIES, VERIFY_PARTICIPANT]);
  const getStudySettingsRS :?RequestState = useRequestState([STUDIES, GET_STUDY_SETTINGS]);

  let activityDay = day;
  if (day !== TODAY && day !== YESTERDAY) {
    activityDay = YESTERDAY;
  }

  // 2022-10-14 - today/yesterday is only enabled for english
  if (selectedLanguage?.value !== LanguageCodes.ENGLISH) {
    activityDay = YESTERDAY;
  }

  const initFormSchema = createFormSchema({}, 0, t, studySettings, activityDay);
  const [formSchema, setFormSchema] = useState(initFormSchema); // {schema, uiSchema}

  useEffect(() => {
    dispatch(
      verifyParticipant({
        [PARTICIPANT_ID]: participantId,
        [STUDY_ID]: studyId,
      })
    );
  }, [dispatch, studyId, participantId]);

  useEffect(() => {
    dispatch(getStudySettings(studyId));
  }, [dispatch, studyId]);

  useEffect(() => {
    if (submitTimeUseDiaryRS === RequestStates.FAILURE) {
      setIsErrorModalVisible(true);
    }
  }, [submitTimeUseDiaryRS]);

  // select default language
  useEffect(() => {
    const defaultLngCode = Cookies.get(DEFAULT_LANGUAGE) || LanguageCodes.ENGLISH;

    const defaultLng = SUPPORTED_LANGUAGES.find((lng) => lng.code === defaultLngCode);
    if (defaultLng) {
      setSelectedLanguage({
        label: defaultLng.language,
        value: defaultLng.code
      });
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const newSchema = createFormSchema(formData, page, t, studySettings, activityDay);
    setFormSchema(newSchema);
  }, [page, selectedLanguage?.value, t, activityDay]);
  /* eslint-enable */

  const refreshProgress = (currFormData) => {
    const dayStart = selectTimeByPageAndKey(DAY_SPAN_PAGE, DAY_START_TIME, currFormData);
    const dayEnd = selectTimeByPageAndKey(DAY_SPAN_PAGE, DAY_END_TIME, currFormData);
    const currentEnd = selectTimeByPageAndKey(page, ACTIVITY_END_TIME, currFormData);

    setDayStartTime(dayStart);
    setDayEndTime(dayEnd);
    setCurrentTime(currentEnd);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    refreshProgress(formData);
    setIsSummaryPage(getIsSummaryPage(formData, page));
  }, [page]);
  /* eslint-enable */

  /* eslint-disable react-hooks/exhaustive-deps */
  const prevSchema = usePrevious(formSchema.schema);
  useEffect(() => {
    if (!isEqual(prevSchema, formSchema.schema)) {
      setIsNightActivityPage(getIsNightActivityPage(formSchema.schema, page, t, studySettings));
    }
  }, [page, formSchema, studySettings]);
  /* eslint-enable */

  const onPageChange = (currPage, currFormData) => {
    setPage(currPage);
    setFormData(currFormData);
  };

  const changeLanguage = (lng :SelectLanguageOption) => {
    if (lng !== null) {
      i18n.changeLanguage(lng.value);
      Cookies.set(DEFAULT_LANGUAGE, lng.value, {});
      setSelectedLanguage(lng);
    }
  };

  const onConfirmChangeLanguage = () => {
    if (languageToChangeTo !== null) {
      setChangeLanguageModalVisible(false);
      setShouldReset(true);
      changeLanguage(languageToChangeTo);
    }
  };

  const onChangeLanguage = (lng :SelectLanguageOption) => {
    if (lng.value === i18n.language) return;

    if (page === SURVEY_INTRO_PAGE) {
      changeLanguage(lng);
      return;
    }
    setLanguageToChangeTo(lng);
    setChangeLanguageModalVisible(true);
  };

  const updateFormState = (schema, uiSchema, currFormData) => {
    setFormData(currFormData);
    setFormSchema({
      uiSchema,
      schema
    });
  };

  const updateSurveyProgress = (currFormData :Object) => {
    refreshProgress(currFormData);
    setFormData(currFormData);
  };

  const resetSurvey = (goToPage) => {
    goToPage(SURVEY_INTRO_PAGE);
    setFormData({});
    setShouldReset(false);
  };

  const is12hourFormat = getIs12HourFormatSelected(formData);
  const isDayActivityPage = page >= PAGE_NUMBERS.FIRST_ACTIVITY_PAGE
    && !isSummaryPage
    && !isNightActivityPage;

  if (isPending(verifyParticipantRS) || isPending(getStudySettingsRS)) {
    return (
      <AppContainerWrapper>
        <HeaderComponent onChangeLanguage={onChangeLanguage} selectedLanguage={selectedLanguage} />
        <Box textAlign="center" mt="30px">
          <Spinner size="2x" />
        </Box>
      </AppContainerWrapper>
    );
  }

  if (isFailure(verifyParticipantRS)) {
    return (
      <AppContainerWrapper>
        <HeaderComponent onChangeLanguage={onChangeLanguage} selectedLanguage={selectedLanguage} />
        <BasicErrorComponent>
          <Typography>
            {t(TranslationKeys.ERROR_INVALID_URL)}
          </Typography>
        </BasicErrorComponent>
      </AppContainerWrapper>
    );
  }

  return (
    <AppContainerWrapper>
      <HeaderComponent onChangeLanguage={onChangeLanguage} selectedLanguage={selectedLanguage} />
      <AppContentWrapper>
        <ConfirmChangeLanguage
            handleOnClose={() => setChangeLanguageModalVisible(false)}
            handleOnConfirmChange={onConfirmChangeLanguage}
            isVisible={isChangeLanguageModalVisible}
            language={i18n.language}
            trans={t} />
        <SubmissionErrorModal
            handleOnClose={() => setIsErrorModalVisible(false)}
            isVisible={isErrorModalVisible}
            trans={t} />
        {
          submitTimeUseDiaryRS === RequestStates.SUCCESS
            ? (
              <SubmissionSuccessful trans={t} />
            )
            : (
              <Card>
                <CardSegment>
                  <ProgressBar
                      currentTime={currentTime}
                      dayEndTime={dayEndTime}
                      dayStartTime={dayStartTime}
                      is12hourFormat={is12hourFormat}
                      isDayActivityPage={isDayActivityPage} />
                  <Paged
                      initialFormData={formData}
                      onPageChange={onPageChange}
                      page={page}
                      render={(pagedProps) => (
                        <QuestionnaireForm
                            activityDay={activityDay}
                            familyId={familyId}
                            formSchema={formSchema}
                            initialFormData={formData}
                            isSummaryPage={isSummaryPage}
                            language={i18n.language}
                            organizationId={organizationId}
                            pagedProps={pagedProps}
                            participantId={participantId}
                            resetSurvey={resetSurvey}
                            shouldReset={shouldReset}
                            studyId={studyId}
                            studySettings={studySettings}
                            submitRequestState={submitTimeUseDiaryRS}
                            trans={t}
                            translationData={i18n.store.data}
                            updateFormState={updateFormState}
                            updateSurveyProgress={updateSurveyProgress}
                            waveId={waveId} />
                      )} />
                </CardSegment>
              </Card>
            )
        }
      </AppContentWrapper>
    </AppContainerWrapper>
  );
};

export default TimeUseDiaryContainer;
