// @flow
// Override BaseInput
// https://github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/src/components/widgets/BaseInput.js

import { Component } from 'react';

import { Input } from '../../../lattice-ui-kit';
import KeyCodes from '../constants/KeyCodes';
import { isDefined } from '../../utils/LangUtils';
import type { WidgetProps } from '../types';

type BaseInputElementProps = {|
  max ?:string;
  min ?:string;
  step ?:string;
  uiSchema ?:Object;
|}

type BaseInputProps = {|
  ...WidgetProps,
  ...BaseInputElementProps,
|}

class BaseInput extends Component<BaseInputProps> {

  static defaultProps = {
    max: undefined,
    min: undefined,
    step: undefined,
    uiSchema: undefined,
    // https://github.com/yannickcr/eslint-plugin-react/issues/1593#issuecomment-504685423
    // eslint-disable-next-line react/default-props-match-prop-types
    value: '',
  }

  onChange = (event :SyntheticEvent<*>) => {
    const { onChange, options } = this.props;
    const { value } :HTMLInputElement = event.currentTarget;
    if (onChange) {
      onChange(value === '' ? options.emptyValue : value);
    }
  }

  onKeyDown = (e :SyntheticKeyboardEvent<*>) => {
    if (e.key === KeyCodes.ENTER) {
      e.preventDefault();
    }
  }

  onFocus = (e :SyntheticFocusEvent<*>) => {
    const { onFocus, id } = this.props;
    const { value } = e.currentTarget;
    if (onFocus) {
      onFocus(id, value);
    }
  }

  onBlur = (e :SyntheticFocusEvent<*>) => {
    const { onBlur, id } = this.props;
    const { value } = e.currentTarget;
    if (onBlur) {
      onBlur(id, value);
    }
  }

  render() {
    const {
      autofocus,
      disabled,
      formContext,
      id,
      label,
      onBlur,
      onChange,
      onFocus,
      options,
      rawErrors,
      readonly,
      registry,
      schema,
      value,
      uiSchema,
      ...inputProps
    } = this.props;

    if (options.inputType) {
      inputProps.type = options.inputType;
    }
    else if (!inputProps.type) {
      if (schema.type === 'number') {
        inputProps.type = 'number';
        // Setting step to 'any' fixes a bug in Safari where decimals are not
        // allowed in number inputs
        inputProps.step = 'any';
      }
      else if (schema.type === 'integer') {
        inputProps.type = 'number';
        inputProps.step = '1';
      }
      else {
        inputProps.type = 'text';
      }
    }

    if (isDefined(schema.multipleOf)) inputProps.step = schema.multipleOf;
    if (isDefined(schema.minimum)) inputProps.min = schema.minimum;
    if (isDefined(schema.maximum)) inputProps.max = schema.maximum;

    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <Input
          autoFocus={autofocus}
          disabled={disabled}
          id={id}
          invalid={rawErrors && rawErrors.length}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          readOnly={readonly}
          value={value}
          {...inputProps} />
    );
    /* eslint-enable */
  }
}

export default BaseInput;
