// @flow
import { useEffect, useState } from 'react';

import { ChoiceGroup, Radio } from '../../../../../lattice-ui-kit';
import KeyCodes from '../../../constants/KeyCodes';
import type { WidgetProps } from '../../../types';

const onKeyDown = (e :SyntheticKeyboardEvent<*>) => {
  if (e.key === KeyCodes.ENTER) {
    e.preventDefault();
  }
};
const getOptionsList = (enumOptions, withNone, withOther, otherText = 'Other') => {
  let shallowOptions = [...enumOptions];
  if (withNone) shallowOptions = shallowOptions.concat({ label: 'None', value: 'None' });
  if (withOther) shallowOptions = shallowOptions.concat({ label: otherText, value: otherText });

  return shallowOptions;
};

const RadioWidget = (props :WidgetProps) => {
  const {
    autofocus,
    disabled,
    id,
    name,
    onBlur,
    onChange,
    onFocus,
    options,
    readonly,
    required,
    value
  } = props;
  const {
    enumOptions,
    mode,
    otherText,
    row,
    withNone = false,
    withOther = false,
  } = options;
  const [radioOptions, setRadioOptions] = useState(enumOptions);
  useEffect(() => {
    setRadioOptions(getOptionsList(enumOptions, withNone, withOther, otherText));
  }, [enumOptions, withNone, withOther, otherText]);

  return (
    <ChoiceGroup row={row} id={id}>
      {radioOptions.map((option, i) => {
        const checked = option.value === value;
        const radio = (
          <Radio
              key={`radio_${option.value}`}
              id={`${id}_${option.value}`}
              mode={mode}
              autoFocus={autofocus && i === 0}
              checked={checked}
              disabled={disabled || readonly}
              label={option.label}
              name={name}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={() => onChange(option.value)}
              onKeyDown={onKeyDown}
              required={required}
              type="radio"
              value={option.value} />
        );

        return radio;
      })}
    </ChoiceGroup>
  );
};

export default RadioWidget;
