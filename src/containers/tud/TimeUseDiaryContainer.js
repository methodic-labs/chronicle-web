import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
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
import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';

import { SUBMIT_TIME_USE_DIARY } from './actions';
import ConfirmChangeLanguage from './components/ConfirmChangeLanguage';
import HeaderComponent from './components/HeaderComponent';
import ProgressBar from './components/ProgressBar';
import QuestionnaireForm from './components/QuestionnaireForm';
import SubmissionErrorModal from './components/SubmissionErrorModal';
import SubmissionSuccessful from './components/SubmissionSuccessful';
import SUPPORTED_LANGUAGES from './constants/SupportedLanguages';
import TranslationKeys from './constants/TranslationKeys';
import {
  isDayActivityPage as _isDayActivityPage,
  isSummaryPage as _isSummaryPage,
  createFormSchema,
  getDateTimeFromData,
  getEnableChangesForOhioStateUniversity,
  getIs12HourFormatSelected,
  isIntroPage,
  updateActivityDateAndDay
} from './utils';

import { BasicErrorComponent } from '../../common/components';
import {
  ACTIVITY_END_TIME,
  DAY_END_TIME,
  DAY_START_TIME,
  DEFAULT_LANGUAGE,
  LANGUAGE,
  LanguageCodes,
  PARTICIPANT_ID,
  STUDIES,
  STUDY_ID,
  StudySettingTypes,
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
import { DAY_SPAN_PAGE, INTRO_PAGE } from './constants';

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
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageToChangeTo, setLanguageToChangeTo] = useState(null);
  const [isChangeLanguageModalVisible, setChangeLanguageModalVisible] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  // selectors
  const submitTimeUseDiaryRS = useRequestState([TIME_USE_DIARY, SUBMIT_TIME_USE_DIARY]);
  const verifyParticipantRS = useRequestState([STUDIES, VERIFY_PARTICIPANT]);
  const getStudySettingsRS = useRequestState([STUDIES, GET_STUDY_SETTINGS]);

  let activityDay = day;
  if (day !== TODAY && day !== YESTERDAY) {
    activityDay = YESTERDAY;
  }

  // 2022-10-14 - today/yesterday is only enabled for english, german
  if (selectedLanguage?.value !== LanguageCodes.ENGLISH && selectedLanguage?.value !== LanguageCodes.GERMAN) {
    activityDay = YESTERDAY;
  }

  const initFormSchema = createFormSchema({}, 0, t, studySettings, activityDay);
  const [formSchema, setFormSchema] = useState(initFormSchema); // {schema, uiSchema}

  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);
  const is12hourFormat = getIs12HourFormatSelected(formData);
  const isSummaryPage = _isSummaryPage(page, formData, activityDay, enableChangesForOSU);
  const isDayActivityPage = _isDayActivityPage(page, formData, activityDay, enableChangesForOSU);

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

  const changeLanguage = (lng) => {
    if (lng !== null) {
      i18n.changeLanguage(lng.value);
      Cookies.set(DEFAULT_LANGUAGE, lng.value, {});
      setSelectedLanguage(lng);
    }
  };

  const configuredLanguageCode = studySettings.getIn(
    [StudySettingTypes.TIME_USE_DIARY, LANGUAGE]
  ) || LanguageCodes.ENGLISH;

  // select default language
  useEffect(() => {
    const defaultLanguageCookie = Cookies.get(DEFAULT_LANGUAGE);
    let defaultLanguage = SUPPORTED_LANGUAGES.find((lng) => lng.code === defaultLanguageCookie);
    const defaultLanguageCode = defaultLanguage?.code || configuredLanguageCode;
    defaultLanguage = SUPPORTED_LANGUAGES.find((lng) => lng.code === defaultLanguageCode);
    if (defaultLanguage) {
      setSelectedLanguage({
        label: defaultLanguage.language,
        value: defaultLanguage.code
      });
      if (defaultLanguage.code !== LanguageCodes.ENGLISH) {
        changeLanguage({
          label: defaultLanguage.language,
          value: defaultLanguage.code
        });
      }
    }
  }, [configuredLanguageCode]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!isSummaryPage) {
      const newSchema = createFormSchema(formData, page, t, studySettings, activityDay);
      setFormSchema(newSchema);
    }
  }, [page, selectedLanguage?.value, t, activityDay, isSummaryPage]);
  /* eslint-enable */

  const refreshProgress = (currFormData) => {
    const dayStart = getDateTimeFromData(DAY_SPAN_PAGE, DAY_START_TIME, currFormData);
    const dayEnd = getDateTimeFromData(DAY_SPAN_PAGE, DAY_END_TIME, currFormData);
    const currentEnd = getDateTimeFromData(page, ACTIVITY_END_TIME, currFormData);

    setDayStartTime(dayStart);
    setDayEndTime(dayEnd);
    setCurrentTime(currentEnd);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    updateActivityDateAndDay(formData, activityDay);
    setFormData(formData);
  }, [activityDay]);
  /* eslint-enable */

  const onPageChange = (currPage, currFormData) => {
    setPage(currPage);
    setFormData(currFormData);
  };

  const onConfirmChangeLanguage = () => {
    if (languageToChangeTo !== null) {
      setChangeLanguageModalVisible(false);
      setShouldReset(true);
      changeLanguage(languageToChangeTo);
    }
  };

  const onChangeLanguage = (lng) => {
    if (lng.value === i18n.language) return;

    if (isIntroPage(page)) {
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

  const updateSurveyProgress = (currFormData) => {
    refreshProgress(currFormData);
    setFormData(currFormData);
  };

  const resetSurvey = (goToPage) => {
    goToPage(INTRO_PAGE);
    setFormData({});
    setShouldReset(false);
  };

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
