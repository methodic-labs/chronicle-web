// @flow

import { Component } from 'react';

import { utils } from '@rjsf/core';

import { ChoiceGroup } from '../../../../../lattice-ui-kit';
import OtherInput from '../../../shared/OtherInput';
import { isNonEmptyString } from '../../../../utils/LangUtils';
import type { WidgetProps } from '../../../types';

const {
  getWidget,
  optionsList,
  retrieveSchema
} = utils;

const selectValue = (value, selected :any[], withNone :boolean, noneText = 'None') => {
  if (withNone) return selected.filter((v) => v !== noneText).concat(value);
  return selected.concat(value);
};

const deselectValue = (value, selected :any[]) => selected.filter((v) => v !== value);

const getOtherValueIndex = (value :Array<string>, enumOptions :Object[]) :number => value
  .findIndex((v) => !enumOptions.find((option) => option.value === v));

const getOptionsList = (itemsSchema, withNone, withOther, noneText = 'None', otherText :string = 'Other') => {
  const options :Object[] = optionsList(itemsSchema);
  let shallowOptions = [...options];
  if (withNone) shallowOptions = shallowOptions.concat({ label: noneText, value: noneText });
  if (withOther) shallowOptions = shallowOptions.concat({ label: otherText, value: otherText });

  return shallowOptions;
};

const otherSchema = {
  type: 'string',
};

class CheckboxesWidget extends Component<WidgetProps> {

  static defaultProps = {
    autofocus: false,
    disabled: false,
    readonly: false,
    value: []
  };

  componentDidUpdate(prevProps :WidgetProps) {
    const {
      value,
      onChange,
      options,
      registry,
      schema,
    } = this.props;
    const {
      noneText,
      otherText,
      withNone = false,
      withOther = false,
    } = options;
    const { value: prevFormData } = prevProps;
    const { definitions } = registry;
    const itemsSchema = retrieveSchema(schema.items, definitions, prevFormData);
    const enumOptions = getOptionsList(itemsSchema, withNone, withOther, noneText, otherText);
    const otherValueIndex = getOtherValueIndex(value, enumOptions);

    if (prevFormData.includes(otherText) && !value.includes(otherText) && otherValueIndex !== -1) {
      const copyFormData = [...value];
      copyFormData.splice(otherValueIndex, 1);
      onChange(copyFormData);
    }
  }

  getHandleChange = (option :Object, withNone :boolean, noneText :string = 'None') => (checked :boolean) => {
    const { onChange, value } = this.props;

    if (checked) {
      if (withNone && option.value === noneText) {
        onChange([noneText]);
      }
      else {
        onChange(selectValue(option.value, value, withNone, noneText));
      }
    }
    else {
      onChange(deselectValue(option.value, value));
    }
  }

  handleOtherChange = (otherValue :string = '') => {
    const {
      value,
      registry,
      schema,
      onChange,
      options
    } = this.props;
    const copyFormData = [...value];
    const {
      withNone = false,
      withOther = false,
      noneText,
      otherText
    } = options;
    const { definitions } = registry;
    const itemsSchema = retrieveSchema(schema.items, definitions, otherValue);
    const enumOptions = getOptionsList(itemsSchema, withNone, withOther, noneText, otherText);
    const otherIndex = getOtherValueIndex(value, enumOptions);

    if (otherIndex !== -1) {
      copyFormData[otherIndex] = otherValue;
      onChange(copyFormData);
    }
    else {
      onChange([...copyFormData, otherValue]);
    }
  }

  render() {
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
    } = this.props;

    const {
      columns,
      mode,
      row,
      widget = 'CheckboxWidget',
      withNone = false,
      withOther = false,
      noneText = 'None',
      otherText = 'Other'
    } = options;

    const otherTextValue = isNonEmptyString(otherText) ? otherText : 'Other';

    const noneTextValue = isNonEmptyString(noneText) ? noneText : 'None';

    const { widgets, definitions } = registry;
    const itemsSchema = retrieveSchema(schema.items, definitions, value);
    const enumOptions = getOptionsList(itemsSchema, withNone, withOther, noneTextValue, otherTextValue);
    const Widget = getWidget(schema, widget, widgets);
    const otherValueIndex :number = getOtherValueIndex(value, enumOptions);
    const otherValue = value[otherValueIndex];
    const showOther = withOther && value.includes(otherTextValue);

    return (
      <>
        <ChoiceGroup className="checkboxes" id={id} columns={columns} row={row}>
          {enumOptions.map((option) => {
            const checked = value.indexOf(option.value) !== -1;
            return (
              <Widget
                  mode={mode}
                  id={`${id}_${option.value}`}
                  key={`checkboxes_${option.value}`}
                  autoFocus={autofocus}
                  disabled={disabled || readonly}
                  label={option.label}
                  onBlur={onBlur}
                  onChange={this.getHandleChange(option, withNone, noneTextValue)}
                  onFocus={onFocus}
                  schema={itemsSchema}
                  value={checked} />
            );
          })}
        </ChoiceGroup>
        { showOther && (
          <OtherInput
              autofocus
              disabled={disabled}
              formContext={formContext}
              id={id}
              name="otherInput"
              onBlur={onBlur}
              onChange={this.handleOtherChange}
              onFocus={onFocus}
              options={options}
              rawErrors={[]}
              readonly={readonly}
              registry={registry}
              required={false}
              schema={otherSchema}
              type="text"
              value={otherValue} />
        )}
      </>
    );
  }
}

export default CheckboxesWidget;
