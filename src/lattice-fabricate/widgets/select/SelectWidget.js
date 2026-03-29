// @flow

import { Component } from 'react';

import { Creatable, Select } from '../../../lattice-ui-kit';
import type { WidgetProps } from '../types';

type Option = {
  label :string;
  value :string | number;
};

const removeEmptyEnums = (enumOptions :Option[]) => enumOptions.filter((enumOption) => enumOption.value !== '');

class SelectWidget extends Component<WidgetProps> {
  static defaultProps = {
    multiple: false,
  };

  handleChange = (value :Option | Option[]) => {
    const { onChange } = this.props;
    onChange(value);
  }

  render() {
    const {
      autofocus,
      disabled,
      id,
      onBlur,
      onFocus,
      options,
      rawErrors,
      required,
      schema,
      value,
      placeholder = '',
    } = this.props;

    const { options: schemaOptions } = schema;

    const {
      enumOptions = [],
      creatable,
      hideMenu,
      multiple,
      noOptionsMessage,
    } = options;

    const selectOptions = schemaOptions || enumOptions;
    const noEmptyOptions = removeEmptyEnums(selectOptions);
    const invalid = rawErrors && rawErrors.length;
    const SelectComponent = creatable ? Creatable : Select;

    return (
      <SelectComponent
          autoFocus={autofocus}
          blurInputOnSelect={!multiple}
          closeMenuOnSelect={!multiple}
          hideMenu={hideMenu}
          id={id}
          invalid={invalid}
          isClearable={!required}
          isDisabled={disabled}
          isMulti={multiple}
          noOptionsMessage={() => noOptionsMessage}
          onBlur={onBlur}
          onChange={this.handleChange}
          onFocus={onFocus}
          options={noEmptyOptions}
          placeholder={placeholder}
          useRawValues
          value={value} />
    );
  }
}

export default SelectWidget;
