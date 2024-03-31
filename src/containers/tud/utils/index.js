import { get, getIn } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { DateTime } from 'luxon';

import createEnglishTranslationLookup from './createEnglishTranslationLookup';
import translateToEnglish from './translateToEnglish';

import {
  ACTIVITY_DATE,
  ACTIVITY_DAY,
  ACTIVITY_END_TIME,
  ACTIVITY_NAME,
  ACTIVITY_SELECT_PAGE,
  ACTIVITY_START_TIME,
  BED_TIME_BEFORE_ACTIVITY_DAY,
  CLOCK_FORMAT,
  DAY_END_TIME,
  DAY_START_TIME,
  FAMILY_ID,
  HAS_FOLLOWUP_QUESTIONS,
  OTHER_ACTIVITY,
  SECONDARY_ACTIVITY,
  TODAY,
  WAKE_UP_TIME_AFTER_ACTIVITY_DAY,
  WAVE_ID,
  YESTERDAY,
} from '../../../common/constants';
import { DAY_SPAN_PAGE, INTRO_PAGE, PRE_SURVEY_PAGE } from '../constants';
import { QUESTION_TITLE_LOOKUP } from '../constants/GeneralConstants';
import { PRIMARY_ACTIVITIES } from '../constants/SchemaConstants';
import TranslationKeys from '../constants/TranslationKeys';
import * as ContextualSchema from '../schemas/ContextualSchema';
import * as DaySpanSchema from '../schemas/DaySpanSchema';
import * as NightTimeActivitySchema from '../schemas/NightTimeActivitySchema';
import * as PreSurveySchema from '../schemas/PreSurveySchema';
import * as PrimaryActivitySchema from '../schemas/PrimaryActivitySchema';
import * as SurveyIntroSchema from '../schemas/SurveyIntroSchema';
import * as WakeUpPageSchema from '../schemas/WakeUpPageSchema';
import getDateTimeFromData from './getDateTimeFromData';
import getEnableChangesForOhioStateUniversity from './getEnableChangesForOhioStateUniversity';
import getFirstActivityPage from './getFirstActivityPage';
import isDaySpanPage from './isDaySpanPage';
import isFirstActivityPage from './isFirstActivityPage';
import isIntroPage from './isIntroPage';
import isNightActivityPage from './isNightActivityPage';
import isPreSurveyPage from './isPreSurveyPage';
import isWakeUpPage from './isWakeUpPage';
import pageHasFollowUpQuestions from './pageHasFollowUpQuestions';

export { default as getDateTimeFromData } from './getDateTimeFromData';
export { default as getEnableChangesForOhioStateUniversity } from './getEnableChangesForOhioStateUniversity';
export { default as getFirstActivityPage } from './getFirstActivityPage';
export { default as isDayActivityPage } from './isDayActivityPage';
export { default as isFirstActivityPage } from './isFirstActivityPage';
export { default as isIntroPage } from './isIntroPage';
export { default as isNightActivityPage } from './isNightActivityPage';
export { default as isSummaryPage } from './isSummaryPage';
export { default as isWakeUpPage } from './isWakeUpPage';
export { default as pageHasFollowUpQuestions } from './pageHasFollowUpQuestions';

const { READING, MEDIA_USE } = PRIMARY_ACTIVITIES;

const { getPageSectionKey, parsePageSectionKey } = DataProcessingUtils;

const selectPrimaryActivityByPage = (pageNum, formData) => {
  const psk = getPageSectionKey(pageNum, 0);

  const activityName = getIn(formData, [psk, ACTIVITY_NAME]);
  return activityName;
};

const getIs12HourFormatSelected = (formData) => getIn(
  formData, [getPageSectionKey(INTRO_PAGE, 0), CLOCK_FORMAT]
) === 12;

const getSecondaryReadingSelected = (formData, page) => getIn(
  formData, [getPageSectionKey(page, 0), SECONDARY_ACTIVITY], []
).includes(READING);

const getSecondaryMediaSelected = (formData, page) => getIn(
  formData, [getPageSectionKey(page, 0), SECONDARY_ACTIVITY], []
).includes(MEDIA_USE);

const createFormSchema = (
  formData,
  pageNum,
  trans,
  studySettings,
  activityDay,
) => {

  const is12hourFormat = getIs12HourFormatSelected(formData);

  const isSecondaryReadingSelected = getSecondaryReadingSelected(formData, pageNum);
  const isSecondaryMediaSelected = getSecondaryMediaSelected(formData, pageNum);

  const enableChangesForSherbrookeUniversity = studySettings
    .getIn(['TimeUseDiary', 'enableChangesForSherbrookeUniversity']) || false;

  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);

  if (isIntroPage(pageNum)) {
    return {
      schema: SurveyIntroSchema.createSchema(trans),
      uiSchema: SurveyIntroSchema.uiSchema
    };
  }

  if (isPreSurveyPage(pageNum)) {
    return {
      schema: PreSurveySchema.createSchema(trans, activityDay),
      uiSchema: PreSurveySchema.createUiSchema(trans)
    };
  }

  if (isDaySpanPage(pageNum)) {
    return {
      schema: DaySpanSchema.createSchema(trans, activityDay, enableChangesForOSU),
      uiSchema: DaySpanSchema.createUiSchema(is12hourFormat)
    };
  }

  if (isNightActivityPage(pageNum, formData, activityDay)) {
    return {
      schema: NightTimeActivitySchema.createSchema(pageNum, trans, studySettings, activityDay),
      uiSchema: NightTimeActivitySchema.createUiSchema(pageNum, trans),
    };
  }

  if (isWakeUpPage(pageNum, formData, activityDay, enableChangesForOSU)) {
    return {
      schema: WakeUpPageSchema.createSchema(pageNum, trans, studySettings),
      uiSchema: WakeUpPageSchema.createUiSchema(pageNum, trans),
    };
  }

  const prevStartTime = getDateTimeFromData(pageNum - 1, ACTIVITY_START_TIME, formData);

  const prevEndTime = isFirstActivityPage(pageNum, activityDay)
    ? getDateTimeFromData(DAY_SPAN_PAGE, DAY_START_TIME, formData)
    : getDateTimeFromData(pageNum - 1, ACTIVITY_END_TIME, formData);

  const currentActivity = selectPrimaryActivityByPage(pageNum, formData);
  const prevActivity = selectPrimaryActivityByPage(pageNum - 1, formData);

  let shouldDisplayFollowup = prevActivity
    && pageNum > getFirstActivityPage(pageNum, activityDay)
    && !pageHasFollowUpQuestions(pageNum - 1, formData);

  if (enableChangesForSherbrookeUniversity) {
    if (prevActivity === PRIMARY_ACTIVITIES.CHILDCARE) {
      shouldDisplayFollowup = false;
    }
  }

  let schema;
  let uiSchema;

  if (shouldDisplayFollowup) {
    schema = ContextualSchema.createSchema(
      pageNum,
      prevActivity,
      prevStartTime,
      prevEndTime,
      isSecondaryReadingSelected,
      isSecondaryMediaSelected,
      trans,
      studySettings,
      activityDay,
    );
    uiSchema = ContextualSchema.createUiSchema(
      pageNum,
      trans,
      studySettings,
      activityDay,
    );
  }
  else {
    schema = PrimaryActivitySchema.createSchema(
      pageNum,
      prevActivity,
      currentActivity,
      prevEndTime,
      is12hourFormat,
      activityDay,
      trans,
    );
    uiSchema = PrimaryActivitySchema.createUiSchema(pageNum, is12hourFormat);
  }

  return {
    schema,
    uiSchema
  };
};

const createTimeUseSummary = (formData, trans, activityDay, studySettings) => {

  const summary = [];

  const enableChangesForOSU = getEnableChangesForOhioStateUniversity(studySettings, activityDay);
  const is12hourFormat = getIs12HourFormatSelected(formData);

  const pages = Object.keys(formData).sort((psk1, psk2) => {
    const { page: pageStr1 } = parsePageSectionKey(psk1);
    const p1 = parseInt(pageStr1, 10);
    const { page: pageStr2 } = parsePageSectionKey(psk2);
    const p2 = parseInt(pageStr2, 10);
    return p1 - p2;
  });

  let wakeUpPage = -1;
  pages.forEach((key) => {
    const { page: pageStr } = parsePageSectionKey(key);
    const page = parseInt(pageStr, 10);
    if (isWakeUpPage(page, formData, activityDay, enableChangesForOSU)) {
      wakeUpPage = page;
    }
  });

  // get day duration (start and end)
  const dayStartTime = getDateTimeFromData(DAY_SPAN_PAGE, DAY_START_TIME, formData);
  const dayEndTime = getDateTimeFromData(DAY_SPAN_PAGE, DAY_END_TIME, formData);

  const formattedDayStartTime = is12hourFormat
    ? dayStartTime.toLocaleString(DateTime.TIME_SIMPLE)
    : dayStartTime.toLocaleString(DateTime.TIME_24_SIMPLE);

  const formattedDayEndTime = is12hourFormat
    ? dayEndTime.toLocaleString(DateTime.TIME_SIMPLE)
    : dayEndTime.toLocaleString(DateTime.TIME_24_SIMPLE);

  const btbad = getDateTimeFromData(DAY_SPAN_PAGE, BED_TIME_BEFORE_ACTIVITY_DAY, formData);
  const formattedBTBAD = is12hourFormat
    ? btbad.toLocaleString(DateTime.TIME_SIMPLE)
    : btbad.toLocaleString(DateTime.TIME_24_SIMPLE);

  let wutaad;
  if (enableChangesForOSU) {
    wutaad = getDateTimeFromData(wakeUpPage, WAKE_UP_TIME_AFTER_ACTIVITY_DAY, formData);
  }
  else {
    wutaad = getDateTimeFromData(DAY_SPAN_PAGE, WAKE_UP_TIME_AFTER_ACTIVITY_DAY, formData);
  }

  const formattedWUTAAD = is12hourFormat
    ? wutaad.toLocaleString(DateTime.TIME_SIMPLE)
    : wutaad.toLocaleString(DateTime.TIME_24_SIMPLE);

  if (activityDay === TODAY) {
    summary.push({
      description: trans(TranslationKeys.CHILD_WENT_TO_BED_LAST_NIGHT),
      key: `${formattedBTBAD}-last-night`,
      pageNum: DAY_SPAN_PAGE,
      time: formattedBTBAD,
    });
  }

  // add day start time
  summary.push({
    key: `${formattedDayStartTime}-today`,
    description: (
      activityDay === TODAY
        ? trans(TranslationKeys.CHILD_WOKE_UP_TODAY)
        : trans(TranslationKeys.CHILD_WOKE_UP)
    ),
    pageNum: DAY_SPAN_PAGE,
    time: formattedDayStartTime,
  });

  pages.forEach((key) => {
    const { page: pageStr } = parsePageSectionKey(key);
    const page = parseInt(pageStr, 10);

    // skip these pages
    if (
      page === INTRO_PAGE
      || page === PRE_SURVEY_PAGE
      || page === DAY_SPAN_PAGE
      || isWakeUpPage(page, formData, activityDay, enableChangesForOSU)
      || pageHasFollowUpQuestions(page, formData)
    ) {
      return;
    }

    // only add entry for night activity page if activity day is "yesterday"
    // (i.e. original logic before "yesterday"/"today" was introduced)
    if (isNightActivityPage(page, formData, activityDay)) {
      if (activityDay === YESTERDAY) {
        summary.push({
          description: trans(TranslationKeys.SLEEPING),
          key: `${formattedDayEndTime} - ${formattedWUTAAD}`,
          pageNum: page,
          time: `${formattedDayEndTime} - ${formattedWUTAAD}`,
        });
      }
      return;
    }

    const startTime = getDateTimeFromData(page, ACTIVITY_START_TIME, formData);
    const endTime = getDateTimeFromData(page, ACTIVITY_END_TIME, formData);
    const primaryActivity = selectPrimaryActivityByPage(page, formData);

    const startFormatted = is12hourFormat
      ? startTime.toLocaleString(DateTime.TIME_SIMPLE)
      : startTime.toLocaleString(DateTime.TIME_24_SIMPLE);

    const endFormatted = is12hourFormat
      ? endTime.toLocaleString(DateTime.TIME_SIMPLE)
      : endTime.toLocaleString(DateTime.TIME_24_SIMPLE);

    const entry = {
      key: `${startFormatted} - ${endFormatted}`,
      description: primaryActivity,
      pageNum: page,
      time: `${startFormatted} - ${endFormatted}`,
    };

    summary.push(entry);
  });

  if (activityDay === TODAY) {
    summary.push({
      description: trans(TranslationKeys.CHILD_WENT_TO_BED_TONIGHT),
      key: `${formattedDayEndTime}-tonight`,
      pageNum: DAY_SPAN_PAGE,
      time: formattedDayEndTime,
    });
  }

  return summary;
};

const formatTime = (time) => time.toLocaleString(DateTime.TIME_SIMPLE);

const applyCustomValidation = (
  formData,
  errors,
  pageNum,
  trans,
) => {
  const psk = getPageSectionKey(pageNum, 0);

  // For each activity, end date should greater than start date
  const startTimeKey = pageNum === DAY_SPAN_PAGE ? DAY_START_TIME : ACTIVITY_START_TIME;
  const endTimeKey = pageNum === DAY_SPAN_PAGE ? DAY_END_TIME : ACTIVITY_END_TIME;

  const currentStartTime = getDateTimeFromData(pageNum, startTimeKey, formData);
  const currentEndTime = getDateTimeFromData(pageNum, endTimeKey, formData);
  const dayEndTime = getDateTimeFromData(DAY_SPAN_PAGE, DAY_END_TIME, formData);

  const errorMsg = pageNum === DAY_SPAN_PAGE
    ? trans(TranslationKeys.ERROR_INVALID_BED_TIME, { time: formatTime(currentStartTime) })
    : trans(TranslationKeys.ERROR_INVALID_END_TIME, { time: formatTime(currentStartTime) });

  if (currentStartTime.isValid && currentEndTime.isValid) {
    if (currentEndTime.valueOf() <= currentStartTime.valueOf()) {
      errors[psk][endTimeKey].addError(errorMsg);
    }
    // the last activity of the day should end at the time the child went to bed
    if (currentEndTime.valueOf() > dayEndTime.valueOf()) {
      errors[psk][endTimeKey].addError(trans(TranslationKeys.ERROR_END_PAST_BEDTIME, { time: formatTime(dayEndTime) }));
    }
  }

  return errors;
};

const stringifyValue = (value) => {
  if (typeof value === 'boolean') {
    if (value) {
      return 'true';
    }
    return 'false';
  }
  return value;
};

// TODO: omit first page (clock format select) from form
const createSubmitRequestBody = (
  formData,
  familyId,
  waveId,
  language,
  translationData
) => {
  let result = [];

  const activityDate = formData[getPageSectionKey(0, 0)][ACTIVITY_DATE];
  result.push({
    code: ACTIVITY_DATE,
    question: ACTIVITY_DATE,
    response: [activityDate],
  });

  const activityDay = formData[getPageSectionKey(0, 0)][ACTIVITY_DAY];
  result.push({
    code: ACTIVITY_DAY,
    question: ACTIVITY_DAY,
    response: [activityDay],
  });

  const activityDateTime = DateTime.fromISO(activityDate);

  // create english translation lookup
  const englishTranslationLookup = createEnglishTranslationLookup(translationData, language);

  const entriesToOmit = [
    ACTIVITY_END_TIME,
    ACTIVITY_SELECT_PAGE,
    ACTIVITY_START_TIME,
    CLOCK_FORMAT,
    HAS_FOLLOWUP_QUESTIONS,
    OTHER_ACTIVITY,
  ];

  Object.entries(formData).forEach(([psk, pageData]) => {

    const parsed = parsePageSectionKey(psk);
    const { page } = parsed;

    if (parseInt(page, 10) !== INTRO_PAGE) {

      let startTime = get(pageData, ACTIVITY_START_TIME);
      let endTime = get(pageData, ACTIVITY_END_TIME);

      if (startTime && endTime) {
        startTime = DateTime.fromISO(startTime);
        startTime = activityDateTime.set({ hour: startTime.hour, minute: startTime.minute });

        endTime = DateTime.fromISO(endTime);
        endTime = activityDateTime.set({ hour: endTime.hour, minute: endTime.minute });
      }

      // $FlowFixMe
      const sectionData = Object.entries(pageData) // $FlowFixMe
        .filter((entry) => !(entry[0] === ACTIVITY_NAME && !get(pageData, HAS_FOLLOWUP_QUESTIONS, false)))
        .filter((entry) => !entriesToOmit.includes(entry[0]))
        .map(([key, value]) => {
          const stringVal = stringifyValue(value);
          const entity = {
            response: translateToEnglish(key, stringVal, language, englishTranslationLookup),
            code: key,
            question: get(QUESTION_TITLE_LOOKUP, key, key),
            ...(startTime && endTime) && {
              startDateTime: startTime,
              endDateTime: endTime
            }
          };
          return entity;
        });

      result = [...result, ...sectionData];
    }
  });

  // waveId & familyId
  if (waveId) {
    result.push({
      response: [waveId],
      code: WAVE_ID,
      question: 'Wave Id'
    });
  }
  if (familyId) {
    result.push({
      response: [familyId],
      code: FAMILY_ID,
      question: 'Family Id'
    });
  }

  return result;
};

// function getAnswerString(
//   questionAnswerId :Map,
//   answersMap :Map,
//   property :string
// ) {
//   return answersMap.get(questionAnswerId.get(property), List()).toJS();
// }

// function getTimeRangeValue(values :Map, timeRangeId :UUID, key :FQN) {
//   const dateVal = values.getIn([timeRangeId, key, 0]);
//   return DateTime.fromISO(dateVal);
// }

// function exportRawDataToCsvFile(
//   dataType :DataType,
//   outputFileName :string,
//   submissionMetadata :Map, // { submissionId: {participantId: _, date: }}
//   answersMap :Map, // { answerId -> answer value }
//   nonTimeRangeQuestionAnswerMap :Map, // submissionId -> question code -> answerID
//   timeRangeQuestionAnswerMap :Map, // submissionId -> timeRangeId -> question code -> answerId
//   submissionTimeRangeValues :Map // submission -> timeRangeId -> { start: <val>, end: <val>}
// ) {
//
//   let csvData :Object[] = [];
//   submissionMetadata.forEach((metadata :Map, submissionId :UUID) => {
//     const questionAnswerId = nonTimeRangeQuestionAnswerMap.get(submissionId);
//     const timeRangeQuestions=timeRangeQuestionAnswerMap.get(submissionId); //timeRangeId->questioncode->answerId
//     const timeRangeValues = submissionTimeRangeValues.get(submissionId); // timeRangeId => { start: <?>, end: <?>}
//
//     const csvMetadata = {};
//     csvMetadata.Participant_ID = String(metadata.getIn([PERSON_ID, 0]));
//     csvMetadata.Family_ID = getAnswerString(questionAnswerId, answersMap, FAMILY_ID);
//     csvMetadata.Wave_Id = getAnswerString(questionAnswerId, answersMap, WAVE_ID);
//     csvMetadata.Timestamp = DateTime
//       .fromISO((metadata.getIn([DATE_TIME_FQN, 0])))
//       .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
//     csvMetadata.Day = getAnswerString(questionAnswerId, answersMap, DAY_OF_WEEK);
//     csvMetadata.Typical_Day = getAnswerString(questionAnswerId, answersMap, TYPICAL_DAY_FLAG);
//     csvMetadata.Non_Typical_Reason = getAnswerString(questionAnswerId, answersMap, NON_TYPICAL_DAY_REASON);
//
//     const nightTimeData = {};
//
//     const yesterdayWakeupTime = DateTime
//       .fromISO(answersMap.getIn([questionAnswerId.get(DAY_START_TIME), 0]))
//       .minus({ days: 1 });
//     const yesterdayBedtime = DateTime
//       .fromISO(answersMap.getIn([questionAnswerId.get(DAY_END_TIME), 0]))
//       .minus({ days: 1 });
//     const todayWakeUpTime = DateTime
//       .fromISO(answersMap.getIn([questionAnswerId.get(TODAY_WAKEUP_TIME), 0]));
//     const dayTimeHours = yesterdayBedtime.diff(yesterdayWakeupTime, 'hours').toObject().hours;
//     const sleepHours = todayWakeUpTime.diff(yesterdayBedtime, 'hours').toObject().hours;
//
//     nightTimeData.Wakeup_Yesterday = yesterdayWakeupTime.toLocaleString(DateTime.TIME_24_SIMPLE);
//     nightTimeData.Bedtime_Yesterday = yesterdayBedtime.toLocaleString(DateTime.TIME_24_SIMPLE);
//     nightTimeData.Wakeup_Today = todayWakeUpTime.toLocaleString(DateTime.TIME_24_SIMPLE);
//     nightTimeData.Daytime_Hours = dayTimeHours;
//     nightTimeData.Sleep_Hours = sleepHours;
//     nightTimeData.Typical_Sleep_Pattern = getAnswerString(questionAnswerId, answersMap, SLEEP_PATTERN);
//     nightTimeData.Non_Typical_Sleep_Pattern=getAnswerString(questionAnswerId, answersMap, NON_TYPICAL_SLEEP_PATTERN);
//     nightTimeData.Sleeping_Arrangement = getAnswerString(questionAnswerId, answersMap, SLEEP_ARRANGEMENT);
//     nightTimeData.Wake_Up_Count = getAnswerString(questionAnswerId, answersMap, WAKE_UP_COUNT);
//     nightTimeData.Background_TV_Night = getAnswerString(questionAnswerId, answersMap, BG_TV_NIGHT);
//     nightTimeData.Background_Audio_Night = getAnswerString(questionAnswerId, answersMap, BG_AUDIO_NIGHT);
//
//     if (dataType === DataTypes.NIGHTTIME) {
//       csvData.push({ ...csvMetadata, ...nightTimeData });
//       return;
//     }
//
//     let submissionData = [];
//     timeRangeQuestions.forEach((questions :Map, timeRangeId :UUID) => {
//       const activitiesData = {};
//
//       activitiesData.Counter = 0;
//       activitiesData.Primary_Activity = getAnswerString(questions, answersMap, ACTIVITY_NAME);
//       activitiesData.Activity_Start = getTimeRangeValue(
//         timeRangeValues, timeRangeId, DATETIME_START_FQN
//       );
//       activitiesData.Activity_End = getTimeRangeValue(
//         timeRangeValues, timeRangeId, DATETIME_END_FQN
//       );
//       const duration = activitiesData.Activity_End.diff(activitiesData.Activity_Start, 'minutes').toObject().minutes;
//       activitiesData['Duration(Min)'] = duration;
//       activitiesData.Caregiver = getAnswerString(questions, answersMap, CAREGIVER);
//       activitiesData.Primary_Media_Activity = getAnswerString(questions, answersMap, PRIMARY_MEDIA_ACTIVITY);
//       activitiesData.Primary_Media_Age = getAnswerString(questions, answersMap, PRIMARY_MEDIA_AGE);
//       activitiesData.Primary_Media_Name = getAnswerString(questions, answersMap, PRIMARY_MEDIA_NAME);
//       activitiesData.Primary_Book_Type = getAnswerString(questions, answersMap, PRIMARY_BOOK_TYPE);
//       activitiesData.Primary_Book_Title = getAnswerString(questions, answersMap, PRIMARY_BOOK_TITLE);
//       activitiesData.Secondary_Media_Activity = getAnswerString(questions, answersMap, SECONDARY_MEDIA_ACTIVITY);
//       activitiesData.Secondary_Media_Age = getAnswerString(questions, answersMap, SECONDARY_MEDIA_AGE);
//       activitiesData.Secondary_Media_Name = getAnswerString(questions, answersMap, SECONDARY_MEDIA_NAME);
//       activitiesData.Secondary_Book_Type = getAnswerString(questions, answersMap, SECONDARY_BOOK_TYPE);
//       activitiesData.Secondary_Book_Title = getAnswerString(questions, answersMap, SECONDARY_BOOK_TITLE);
//       activitiesData.Secondary_Activity = getAnswerString(questions, answersMap, SECONDARY_ACTIVITY);
//       activitiesData.Background_TV_Day = getAnswerString(questions, answersMap, BG_TV_DAY);
//       activitiesData.Background_Audio_Day = getAnswerString(questions, answersMap, BG_AUDIO_DAY);
//       activitiesData.Adult_Media_Use = getAnswerString(questions, answersMap, ADULT_MEDIA);
//
//       submissionData.push(activitiesData);
//     });
//
//     // sort
//     submissionData = submissionData.sort((row1 :Object, row2 :Object) => {
//       if (row1.Activity_Start > row2.Activity_Start) return 1;
//       if (row1.Activity_Start < row2.Activity_Start) return -1;
//       return 0;
//     }).map((row :Object, index :number) => ({
//       ...csvMetadata,
//       ...row,
//       Activity_Start: row.Activity_Start.toLocaleString(DateTime.TIME_24_SIMPLE),
//       Activity_End: row.Activity_End.toLocaleString(DateTime.TIME_24_SIMPLE),
//       Counter: index + 1,
//     }));
//
//     csvData = csvData.concat(submissionData);
//   });
//
//   const csv = Papa.unparse(csvData);
//   const blob = new Blob([csv], {
//     type: 'text/csv'
//   });
//
//   FS.saveAs(blob, outputFileName);
// }

// function exportSummarizedDataToCsvFile(
//   summaryData :Map,
//   submissionMetadata :Map,
//   csvHeaders :OrderedSet,
//   fileName :string
// ) {
//
//   const csvData :Object[] = [];
//
//   summaryData.forEach((submissionSummary :Map, submissionId :UUID) => {
//     const rowData :Object = {};
//     rowData.participantId = submissionMetadata.getIn([submissionId, PERSON_ID, 0]);
//     rowData.Timestamp = DateTime
//       .fromISO((submissionMetadata.getIn([submissionId, DATE_TIME_FQN, 0])))
//       .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
//     csvHeaders.forEach((header :string) => {
//       if (submissionSummary.has(header)) {
//         rowData[header] = submissionSummary.get(header);
//       }
//     });
//     csvData.push(rowData);
//
//   });
//
//   const csv = Papa.unparse(csvData);
//   const blob = new Blob([csv], {
//     type: 'text/csv'
//   });
//
//   FS.saveAs(blob, fileName);
// }

// const getOutputFileName = (date :?string, startDate :?string, endDate :?string, dataType :DataType) => {
//   const prefix = 'TimeUseDiary';
//
//   if (date) {
//     return `${prefix}_${dataType}_${date}`;
//   }
//   if (startDate && endDate) {
//     return `${prefix}_${dataType}_${startDate}-${endDate}`;
//   }
//
//   return prefix;
// };

const updateActivityDateAndDay = (formData, activityDay) => {
  const psk = getPageSectionKey(0, 0);
  const activityDate = activityDay === TODAY
    ? DateTime.local().toISODate()
    : DateTime.local().minus({ days: 1 }).toISODate();
  _set(formData, [psk, ACTIVITY_DATE], activityDate);
  _set(formData, [psk, ACTIVITY_DAY], activityDay);
};

const updateDayEndTime = (formData) => {
  const psk = getPageSectionKey(DAY_SPAN_PAGE, 0);
  const dayEndTime = _get(formData, [psk, DAY_END_TIME]);
  if (typeof dayEndTime === 'string' && dayEndTime.startsWith('24:')) {
    _set(formData, [psk, DAY_END_TIME], dayEndTime.replace('24:', '00:'));
  }
};

export {
  applyCustomValidation,
  createFormSchema,
  createSubmitRequestBody,
  createTimeUseSummary,
  formatTime,
  getIs12HourFormatSelected,
  selectPrimaryActivityByPage,
  updateActivityDateAndDay,
  updateDayEndTime,
};
