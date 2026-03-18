// @flow
import { useCallback } from 'react';

import { DatePicker } from '../../../lattice-ui-kit';
import type { WidgetProps } from '../types';

const DateWidget = (props :WidgetProps) => {

  const {
    disabled,
    id,
    onChange,
    options,
    placeholder,
    readonly,
    value,
  } = props;
  const { format, mask } = options;

  // RJSF requires date/times to be undefined to trigger required validation
  const handleChange = useCallback((newValue :string) => {
    if (newValue === '') {
      onChange(undefined);
    }
    else {
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <DatePicker
        disabled={disabled || readonly}
        format={format}
        id={id}
        mask={mask}
        onChange={handleChange}
        placeholder={placeholder}
        value={value} />
  );
};

export default DateWidget;
