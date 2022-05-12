/*
 * @flow
 */

import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Typography
} from 'lattice-ui-kit';

import getParticipantDataDownloadUrl from '../utils/getParticipantDataDownloadUrl';
import { ParticipantDataTypes, TimeUseDiaryDataTypes } from '../../../common/constants';

const {
  USAGE_EVENTS,
  PREPROCESSED,
  APP_USAGE_SURVEY,
  TIME_USE_DIARY,
  IOS_SENSOR
} = ParticipantDataTypes;

const {
  DAYTIME,
  NIGHTTIME,
  SUMMARIZED
} = TimeUseDiaryDataTypes;

const dataTypeSelectorLabel = {
  [USAGE_EVENTS]: 'Android Raw Data',
  [IOS_SENSOR]: 'iOS Sensor Data',
  [PREPROCESSED]: 'Preprocessed Data',
  [APP_USAGE_SURVEY]: 'App Usage Survey Data',
  [TIME_USE_DIARY]: 'Time Use Diary Data'
};

const timeUseDiaryDataTypeOptions = [
  {
    label: 'Day Time',
    value: DAYTIME
  },
  {
    label: 'Night Time',
    value: NIGHTTIME
  },
  {
    label: 'Summarized',
    value: SUMMARIZED
  }
];

type Props = {
  handleOnClose :() => void;
  hasAndroidDataCollection :boolean;
  hasIOSSensorDataCollection :boolean;
  hasTimeUseDiary :boolean;
  isVisible :boolean;
  participantId :string;
  studyId :UUID;
}

const DownloadParticipantDataModal = (props :Props) => {
  const {
    handleOnClose,
    hasAndroidDataCollection,
    hasIOSSensorDataCollection,
    hasTimeUseDiary,
    isVisible,
    participantId,
    studyId
  } = props;

  const [dataType, setDataType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tudDataType, setTudDataType] = useState(null);
  const [filename, setFilename] = useState(undefined);
  const [isTudDataTypeSelectorVisible, setTudDataTypeSelectorVisible] = useState(false);

  useEffect(() => {
    setTudDataTypeSelectorVisible(dataType && dataType.value === TIME_USE_DIARY);
  }, [dataType]);

  const dataTypes = useMemo(() => {
    const result = [];

    if (hasAndroidDataCollection) {
      result.push(USAGE_EVENTS);
      result.push(PREPROCESSED);
      result.push(APP_USAGE_SURVEY);
    }
    if (hasTimeUseDiary) {
      result.push(TIME_USE_DIARY);
    }

    if (hasIOSSensorDataCollection) {
      result.push(IOS_SENSOR);
    }
    return result;
  }, [hasAndroidDataCollection, hasTimeUseDiary, hasIOSSensorDataCollection]);

  const dataTypeSelectOptions = useMemo(() => dataTypes.map((type) => ({
    value: type,
    label: dataTypeSelectorLabel[type]
  })), [dataTypes]);

  const handleOnClick = () => {
    const url = getParticipantDataDownloadUrl(
      studyId,
      participantId,
      startDate,
      endDate,
      dataType?.value || null,
      tudDataType?.value || null,
      filename
    );

    window.open(url, '_blank');
  };

  const handleOnChange = (event :SyntheticInputEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    const { value } = currentTarget;
    setFilename(value);
  };

  const nonTudTypes = [USAGE_EVENTS, PREPROCESSED, APP_USAGE_SURVEY, IOS_SENSOR];
  const isButtonEnabled = dataType && ((nonTudTypes.includes(dataType.value)) || tudDataType);

  const renderModalBody = () => (
    <Box pb="10px">
      <Box mb="20px">
        <Typography>
          What kind of data do you want to download?
        </Typography>
        <Select
            options={dataTypeSelectOptions}
            value={dataType}
            onChange={(value) => setDataType(value)} />
      </Box>
      {
        isTudDataTypeSelectorVisible && (
          <Box mb="20px">
            <Typography>
              Select category
            </Typography>
            <Select
                options={timeUseDiaryDataTypeOptions}
                value={tudDataType}
                onChange={(value) => setTudDataType(value)} />
          </Box>
        )
      }
      <Box mb="20px">
        <Typography>
          Select start date (optional)
        </Typography>
        <DatePicker
            value={startDate}
            onChange={(value) => setStartDate(value)} />
      </Box>
      <Box mb="20px">
        <Typography>
          Select end date (optional)
        </Typography>
        <DatePicker
            value={endDate}
            onChange={(value) => setEndDate(value)} />
      </Box>
      <Box mb="20px">
        <Typography>
          Enter download filename (optional)
        </Typography>
        <Input
            onChange={handleOnChange}
            inputProps={{ maxLength: 12 }}
            value={filename} />
      </Box>
      <Button
          color="primary"
          disabled={!isButtonEnabled}
          fullWidth
          onClick={handleOnClick}>
        Download
      </Button>
    </Box>
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        textSecondary="Close"
        shoudStretchButtons
        textTitle={`Download ${participantId}'s Data`}>
      {renderModalBody()}
    </Modal>
  );
};

export default DownloadParticipantDataModal;
