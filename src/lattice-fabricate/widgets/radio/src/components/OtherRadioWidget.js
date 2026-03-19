// @flow

import { utils } from '@rjsf/core';

import OtherInput from '../../../shared/OtherInput';
import { isNonEmptyString } from '../../../../utils/LangUtils';
import type { WidgetProps } from '../../../types';

const {
  getWidget,
  retrieveSchema
} = utils;

const otherSchema = {
  type: 'string',
};

const getEnumsList = (enums, withNone, withOther, otherText = 'Other') => {
  let shallowEnums = [...enums];
  if (withNone) shallowEnums = shallowEnums.concat('None');
  if (withOther) shallowEnums = shallowEnums.concat(otherText);

  return shallowEnums;
};

const getMiscValueIndex = (value :Array<string>, enums :Object[]) :number => {
  const index = value.findIndex((v) => !enums.find((option) => option === v));
  return index < 0 ? 1 : index;
};

const getEnumValueIndex = (value :Array<string>, enums :Object[]) :number => {
  const index = value.findIndex((v) => enums.find((option) => option === v));
  return index < 0 ? 0 : index;
};

const OtherRadioWidget = (props :WidgetProps) => {

  const {
    autofocus,
    disabled,
    formContext,
    id,
    onBlur,
    onFocus,
    options,
    readonly,
    registry,
    schema,
    value,
    onChange
  } = props;
  const { definitions, widgets } = registry;

  const {
    otherText,
    withNone,
  } = options;

  const otherOptionValue = isNonEmptyString(otherText) ? otherText : 'Other';

  const itemsSchema = retrieveSchema(schema.items, definitions, value);
  const enums = getEnumsList(itemsSchema.enum, withNone, true, otherOptionValue);
  const miscIndex = getMiscValueIndex(value, enums);
  const enumIndex = getEnumValueIndex(value, enums);
  const Widget = getWidget(schema, 'RadioWidget', widgets);
  const showOther = value.includes(otherOptionValue);

  const handleChange = (newValue) => {
    onChange([newValue]);
  };

  const handleOtherChange = (otherValue :string = '') => {
    const copyFormData = [...value];
    copyFormData[miscIndex] = otherValue;
    onChange(copyFormData);
  };

  return (
    <>
      <Widget
          id={id}
          formContext={formContext}
          autoFocus={autofocus}
          disabled={disabled || readonly}
          onBlur={onBlur}
          onChange={handleChange}
          onFocus={onFocus}
          schema={itemsSchema}
          options={{ ...options, otherText: otherOptionValue, withOther: true }}
          registry={registry}
          value={value[enumIndex]} />
      { showOther && (
        <OtherInput
            autofocus
            disabled={disabled}
            formContext={formContext}
            id={`${id}_other`}
            name="otherInput"
            onBlur={onBlur}
            onChange={handleOtherChange}
            onFocus={onFocus}
            options={options}
            rawErrors={[]}
            readonly={readonly}
            registry={registry}
            required={false}
            schema={otherSchema}
            type="text"
            value={value[miscIndex]} />
      )}
    </>
  );
};

OtherRadioWidget.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
  value: []
};

export default OtherRadioWidget;
