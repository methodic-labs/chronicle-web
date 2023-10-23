import { useState } from 'react';

import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIn, merge, setIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Button } from 'lattice-ui-kit';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _set from 'lodash/set';
import _unset from 'lodash/unset';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import styled from 'styled-components';

import {
  ACTIVITY_END_TIME,
  ACTIVITY_SELECT_PAGE,
  ACTIVITY_START_TIME,
  DAY_END_TIME,
  DAY_OF_WEEK,
  DAY_START_TIME,
  FAMILY_ID,
  FORM_DATA,
  HAS_FOLLOWUP_QUESTIONS,
  LANGUAGE,
  ORGANIZATION_ID,
  OTHER_ACTIVITY,
  PARTICIPANT_ID,
  PRIMARY_ACTIVITY,
  PRIMARY_BOOK_LANGUAGE,
  PRIMARY_BOOK_LANGUAGE_NON_ENGLISH,
  PRIMARY_MEDIA_LANGUAGE,
  PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH,
  SECONDARY_ACTIVITY,
  SLEEP_PATTERN,
  STUDY_ID,
  TRANSLATION_DATA,
  TYPICAL_DAY_FLAG,
  WAVE_ID,
} from '../../../common/constants';
import { isNonEmptyString } from '../../../common/utils';
import { submitTimeUseDiary } from '../actions';
import { DAY_SPAN_PAGE } from '../constants';
import TranslationKeys from '../constants/TranslationKeys';
import * as SecondaryFollowUpSchema from '../schemas/SecondaryFollowUpSchema';
import {
  applyCustomValidation,
  getDateTimeFromData,
  isFirstActivityPage,
  selectPrimaryActivityByPage,
  updateActivityDateAndDay
} from '../utils';
import isIntroPage from '../utils/isIntroPage';
import isPreSurveyPage from '../utils/isPreSurveyPage';
import ContextualQuestionsIntro from './ContextualQuestionsIntro';
import SurveyIntro from './SurveyIntro';
import TimeUseSummary from './TimeUseSummary';

const { getPageSectionKey, parsePageSectionKey } = DataProcessingUtils;

const ButtonRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const NextButtonWrapper = styled.div`
  align-items: center;
  display: flex;

  svg {
    margin-right: 16px;
  }
`;

/*
 * This code fixes an issue where the survey enters an error state after a user fills out the survey
 * and later changes the day end time value. If the day end time is changed such that certain sections
 * of the formRef state contain invalid data (the start/end values are out of range), then this will cause
 * validateAndSubmit to fail, hence the need to remove such sections. This deletion need only take place
 * just before we enter the nightActivity portion of the survey. At this point, for all x s.t x > page
 * only x == page + 1 can be expected to contain any data
  (and it should be nightActivity data otherwise it also needs to be deleted)
 */

const removeExtraData = (formRef, pagedData, page) => {
  const psk = getPageSectionKey(page, 0);
  const dayEndTime = getDateTimeFromData(DAY_SPAN_PAGE, DAY_END_TIME, pagedData);
  const formData = formRef?.current?.state?.formData || {};

  const currEndTime = formData[psk]?.[ACTIVITY_END_TIME];

  if (dayEndTime && currEndTime) {
    const currEndDateTime = DateTime.fromSQL(currEndTime);
    if (!currEndDateTime.equals(dayEndTime)) {
      return;
    }

    const pages = Object.keys(formData)
      .map((key) => {
        const parsed = parsePageSectionKey(key);
        return Number(parsed.page);
      });

    let toRemoveStartIndex = page + 1;
    // if the next page has night activity page data, skip
    const nextPageData = formData[getPageSectionKey(toRemoveStartIndex, 0)] || {};
    if (Object.keys(nextPageData).includes(SLEEP_PATTERN)) {
      toRemoveStartIndex += 1;
    }

    const toRemovePsks = pages
      .filter((index) => index >= toRemoveStartIndex)
      .map((index) => getPageSectionKey(index, 0));

    toRemovePsks.forEach((toRemovePsk) => {
      _unset(formData, toRemovePsk);
    });
  }
};

/*
 * This code is crucial when onSubmit is invoked on a page that already contains form data.
 * Ideally, when the endTime value on the previous page is modified, the startTime of current page's
 * activity should be updated to match the new value if the prev page doesn't need followup.
 * Conversely, if the current page contains follow up questions to prev page, the endTime value on
 * current page should be updated. In this case however, onSubmit fails
 * to update the form data state accordingly through the schema's property default value,
 * hence the need for this function.
 */
const forceFormDataStateUpdate = (formRef, pagedData = {}, page, activityDay) => {
  const psk = getPageSectionKey(page, 0);
  const prevEndTime = getDateTimeFromData(
    page - 1,
    (isFirstActivityPage(page, activityDay) ? DAY_START_TIME : ACTIVITY_END_TIME),
    pagedData,
  );
  const activityStartTime = getDateTimeFromData(
    page - 1,
    (isFirstActivityPage(page, activityDay) ? DAY_START_TIME : ACTIVITY_START_TIME),
    pagedData,
  );

  // current page already contains form data
  if (Object.keys(pagedData).includes(psk) && prevEndTime.isValid && activityStartTime.isValid) {
    const formattedEndTime = prevEndTime.toLocaleString(DateTime.TIME_24_SIMPLE);
    const formattedStartTime = activityStartTime.toLocaleString(DateTime.TIME_24_SIMPLE);

    const sectionData = pagedData[psk];
    const formData = formRef?.current?.state?.formData || {};

    // current page contains followup questions for selected primary activity
    if (Object.keys(sectionData).includes(HAS_FOLLOWUP_QUESTIONS)) {
      _set(formData, [psk, ACTIVITY_END_TIME], formattedEndTime);
      _set(formData, [psk, ACTIVITY_START_TIME], formattedStartTime);
      removeExtraData(formRef, pagedData, page);
    }

    // current page is night activity page
    else if (!Object.keys(sectionData).includes(SLEEP_PATTERN)) {
      _set(formData, [psk, ACTIVITY_START_TIME], formattedEndTime);
    }
  }
};

const updateTypicalDayLabel = (formData, page, trans, activityDay) => {
  const psk = getPageSectionKey(page, 0);
  const dayOfWeek = getIn(formData, [psk, DAY_OF_WEEK]);
  if (dayOfWeek) {
    const typicalDayInput = document.getElementById(`root_${getPageSectionKey(page, 0)}_${TYPICAL_DAY_FLAG}`);
    const label = typicalDayInput?.previousSibling;
    if (label) {
      // $FlowFixMe
      label.innerHTML = trans(TranslationKeys.TYPICAL_DAY, { activityDay: trans(activityDay), day: dayOfWeek });
    }
  }
};

const updatePrimaryActivityQuestion = (formData, page, trans) => {
  const currentActivity = selectPrimaryActivityByPage(page, formData);
  if (currentActivity) {
    const endTimeInput = document.getElementById(`root_${getPageSectionKey(page, 0)}_endTime`);
    const label = endTimeInput?.parentNode?.parentNode?.parentNode?.firstChild;
    if (label) {
      // $FlowFixMe
      label.innerHTML = trans(TranslationKeys.ACTIVITY_END_TIME, { activity: currentActivity });
    }
  }
};

const schemaHasFollowupQuestions = (schema = {}, page) => {
  const psk = getPageSectionKey(page, 0);
  const properties = schema?.properties?.[psk]?.properties ?? {};
  return Object.keys(properties).includes(HAS_FOLLOWUP_QUESTIONS);
};

const onChangePrimaryActivity = (data, page) => {
  const psk1 = getPageSectionKey(page, 0);
  if (_get(data, [psk1, ACTIVITY_SELECT_PAGE]) !== true) {
    return;
  }
  const psk2 = getPageSectionKey(page + 1, 0);
  if (!_has(data, psk2)) {
    return;
  }
  const newPrimaryActivity = _get(data, [psk1, PRIMARY_ACTIVITY]);
  const previousPrimaryActivity = _get(data, [psk2, PRIMARY_ACTIVITY]);
  if (
    !isNonEmptyString(newPrimaryActivity)
    || !isNonEmptyString(previousPrimaryActivity)
    || newPrimaryActivity === previousPrimaryActivity
  ) {
    return;
  }
  // primary activity has changed, restart next page
  _unset(data, psk2);
};

const onToggleYesNo = (data, page) => {
  const psk = getPageSectionKey(page, 0);
  const otherActivityYesNo = _get(data, [psk, OTHER_ACTIVITY], 'no');
  if (otherActivityYesNo.toLowerCase() !== 'yes' && _has(data, [psk, SECONDARY_ACTIVITY])) {
    _set(data, [psk, SECONDARY_ACTIVITY], []);
  }
  const bookNonEnglishYesNo = _get(data, [psk, PRIMARY_BOOK_LANGUAGE_NON_ENGLISH], 'no');
  if (bookNonEnglishYesNo.toLowerCase() !== 'yes' && _has(data, [psk, PRIMARY_BOOK_LANGUAGE])) {
    _set(data, [psk, PRIMARY_BOOK_LANGUAGE], []);
  }
  const mediaNonEnglishYesNo = _get(data, [psk, PRIMARY_MEDIA_LANGUAGE_NON_ENGLISH], 'no');
  if (mediaNonEnglishYesNo.toLowerCase() !== 'yes' && _has(data, [psk, PRIMARY_MEDIA_LANGUAGE])) {
    _set(data, [psk, PRIMARY_MEDIA_LANGUAGE], []);
  }
};

const QuestionnaireForm = ({
  activityDay,
  familyId,
  formSchema,
  initialFormData,
  isSummaryPage,
  language,
  organizationId,
  pagedProps,
  participantId,
  resetSurvey,
  shouldReset,
  studyId,
  studySettings,
  submitRequestState,
  trans,
  translationData,
  updateFormState,
  updateSurveyProgress,
  waveId,
}) => {

  const {
    formRef,
    onBack,
    onNext,
    page,
    pagedData,
    setPage,
    validateAndSubmit
  } = pagedProps;

  if (shouldReset) resetSurvey(setPage);

  const dispatch = useDispatch();

  const [hasErrors, setHasErrors] = useState(false);

  const { schema, uiSchema } = formSchema;

  const activities = trans(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });

  const readingSchema = SecondaryFollowUpSchema.createSchema(activities.reading, trans);
  const mediaUseSchema = SecondaryFollowUpSchema.createSchema(activities.media_use, trans);

  const handleNext = () => {
    if (isSummaryPage) {
      dispatch(
        submitTimeUseDiary({
          [FAMILY_ID]: familyId,
          [FORM_DATA]: pagedData,
          [LANGUAGE]: language,
          [ORGANIZATION_ID]: organizationId,
          [PARTICIPANT_ID]: participantId,
          [STUDY_ID]: studyId,
          [TRANSLATION_DATA]: translationData,
          [WAVE_ID]: waveId,
        })
      );
      return;
    }

    forceFormDataStateUpdate(formRef, pagedData, page, activityDay);
    validateAndSubmit();
  };

  const updateFormSchema = (formData, currentSchema, currentUiSchema) => {
    const psk = getPageSectionKey(page, 0);
    const secondaryActivities = getIn(formData, [psk, SECONDARY_ACTIVITY], []);

    const { properties: mediaProperties, required: mediaRequired } = mediaUseSchema;
    const { properties: readingProperties, required: readingRequired } = readingSchema;

    let newProperties = getIn(currentSchema, ['properties', psk, 'properties'], {});
    let newRequired = getIn(currentSchema, ['properties', psk, 'required'], []);

    if (secondaryActivities.includes(activities.media_use)) {
      newProperties = merge(newProperties, mediaProperties);
      newRequired = merge(newRequired, mediaRequired);
    }
    else {
      // remove media properties & required
      Object.keys(mediaProperties).forEach((property) => delete newProperties[property]);
      newRequired = newRequired.filter((property) => !mediaRequired.includes(property));
    }

    if (secondaryActivities.includes(activities.reading)) {
      newProperties = merge(newProperties, readingProperties);
      newRequired = merge(newRequired, readingRequired);
    }
    else {
      // remove reading properties & required
      Object.keys(readingProperties).forEach((property) => delete newProperties[property]);
      newRequired = newRequired.filter((property) => !readingRequired.includes(property));
    }

    let newSchema = setIn(currentSchema, ['properties', psk, 'properties'], newProperties);
    newSchema = setIn(newSchema, ['properties', psk, 'required'], [...new Set(newRequired)]);

    updateFormState(newSchema, currentUiSchema, formData);
  };

  const onChange = ({ formData, schema: currentSchema, uiSchema: currentUiSchema }) => {
    onChangePrimaryActivity(formData, page);
    onToggleYesNo(formData, page);
    updatePrimaryActivityQuestion(formData, page, trans);

    if (isPreSurveyPage(page)) {
      updateTypicalDayLabel(formData, page, trans, activityDay);
    }

    if (schemaHasFollowupQuestions(currentSchema, page)) {
      updateFormSchema(formData, currentSchema, currentUiSchema);
    }

    updateActivityDateAndDay(formData, activityDay);
    updateSurveyProgress(formData);
  };

  const validate = (formData, errors) => (
    applyCustomValidation(formData, errors, page, trans)
  );

  /* eslint-disable no-param-reassign */
  const transformErrors = (errors) => errors.map((error) => {
    if (error.name === 'required') {
      error.message = trans(TranslationKeys.ERROR_RESPONSE_REQUIRED);
    }
    if (error.name === 'minItems') {
      error.message = trans(TranslationKeys.ERROR_MIN_ITEMS);
    }
    if (error.name === 'enum' || error.name === 'oneOf') {
      error.message = '';
    }
    return error;
  });
  /* eslint-enable */

  const schemaHasFollowup = schemaHasFollowupQuestions(schema, page);
  const prevActivity = selectPrimaryActivityByPage(page - 1, pagedData);
  const prevEndTime = getDateTimeFromData(page - 1, ACTIVITY_START_TIME, pagedData);

  const onSubmit = () => {
    setHasErrors(false);
    onNext();
  };

  const onError = () => {
    setHasErrors(true);
  };

  return (
    <>
      {
        isSummaryPage ? (
          <TimeUseSummary
              activityDay={activityDay}
              formData={pagedData}
              goToPage={setPage}
              studySettings={studySettings} />
        ) : (
          <>
            {
              schemaHasFollowup && (
                <ContextualQuestionsIntro
                    selectedActivity={prevActivity}
                    time={prevEndTime}
                    trans={trans} />
              )
            }
            {
              isIntroPage(page) && <SurveyIntro activityDay={activityDay} />
            }
            <Form
                formData={initialFormData}
                hideSubmit
                noPadding
                onChange={onChange}
                onError={onError}
                onSubmit={onSubmit}
                ref={formRef}
                schema={schema}
                transformErrors={transformErrors}
                uiSchema={uiSchema}
                validate={validate} />
          </>
        )
      }
      <ButtonRow>
        <Button
            disabled={page === 0 || submitRequestState === RequestStates.PENDING}
            onClick={onBack}>
          {trans(TranslationKeys.BTN_BACK)}
        </Button>
        <NextButtonWrapper>
          {
            hasErrors && (
              <FontAwesomeIcon color="#ff3c5d" icon={faExclamationCircle} size="lg" />
            )
          }
          <Button
              color="primary"
              isLoading={submitRequestState === RequestStates.PENDING}
              onClick={handleNext}>
            {
              isSummaryPage ? trans(TranslationKeys.BTN_SUBMIT) : trans(TranslationKeys.BTN_NEXT)
            }
          </Button>
        </NextButtonWrapper>
      </ButtonRow>
    </>
  );
};

export default QuestionnaireForm;
