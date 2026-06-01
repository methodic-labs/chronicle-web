// @flow
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useState } from 'react';

import isFunction from 'lodash/isFunction';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { ClockIcon } from 'lucide-react';
import { DateTime } from 'luxon';

import useInputPropsMemo from './hooks/useInputPropsMemo';

const TimePicker = (props :typeof KeyboardTimePicker) => {
  const {
    ampm,
    disabled,
    format,
    fullWidth,
    mask,
    onChange,
    placeholder,
    value,
    ...other
  } = props;

  const [selectedDate, setSelectedDate] = useState(null);
  const [lastValidDate, setLastValidDate] = useState(null);

  useEffect(() => {
    const date = DateTime.fromISO(value);
    if (date.isValid) {
      setSelectedDate(date);
      setLastValidDate(date);
    }
    else {
      setSelectedDate(null);
      setLastValidDate(null);
    }
  }, [value]);

  const inputProps = useInputPropsMemo(lastValidDate, setSelectedDate);

  const handleDateChange = useCallback((date) => {
    if (isFunction(onChange)) {
      if (date === null) {
        onChange();
        setLastValidDate(null);
      }
      if (date && date.isValid) {
        // Persist a locale-independent ISO time ("HH:mm"). toLocaleString is locale dependent
        // (e.g. "13.05" in fi/da, native digits in some locales) and would not parse back via
        // DateTime.fromISO, surfacing as "Invalid DateTime" and breaking submission.
        const timeIso = date.toISOTime({ suppressSeconds: true, suppressMilliseconds: true, includeOffset: false });
        onChange(timeIso);
        setLastValidDate(date);
      }
    }
    setSelectedDate(date);
  }, [onChange]);

  const defaultFormat = ampm ? 'hh:mm a' : 'HH:mm';
  const defaultMask = ampm ? '__:__ _M' : '__:__';
  const defaultPlaceholder = ampm ? 'HH:MM AM' : 'HH:MM';

  return (
    <KeyboardTimePicker
        ampm={ampm}
        InputProps={inputProps}
        disabled={disabled}
        format={format || defaultFormat}
        fullWidth={fullWidth}
        inputVariant="filled"
        keyboardIcon={<ClockIcon size={20} />}
        mask={mask || defaultMask}
        onChange={handleDateChange}
        placeholder={placeholder || defaultPlaceholder}
        value={selectedDate}
        variant="inline"
        PopoverProps={{ dir: 'ltr' }}
        {...other} />
  );
};

TimePicker.defaultProps = {
  ampm: true,
  disabled: false,
  fullWidth: true,
  value: '',
};

export default TimePicker;
