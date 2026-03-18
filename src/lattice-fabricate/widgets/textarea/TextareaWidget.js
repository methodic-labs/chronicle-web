// @flow
import { Component } from 'react';

import { TextArea } from '../../../lattice-ui-kit';
import KeyCodes from '../constants/KeyCodes';
import type { WidgetProps } from '../types';

class TextareaWidget extends Component<WidgetProps> {

  static defaultProps = {
    value: ''
  };

  onChange = (event :SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange, options } = this.props;
    const { value } :HTMLInputElement = event.currentTarget;
    if (onChange) {
      onChange(value === '' ? options.emptyValue : value);
    }
  }

  onKeyDown = (e :SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyCodes.ENTER) {
      e.preventDefault();
    }
  }

  onFocus = (e :SyntheticFocusEvent<HTMLInputElement>) => {
    const { onFocus, id } = this.props;
    const { value } = e.currentTarget;
    if (onFocus) {
      onFocus(id, value);
    }
  }

  onBlur = (e :SyntheticFocusEvent<HTMLInputElement>) => {
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
      id,
      options,
      rawErrors,
      readonly,
      value,
    } = this.props;

    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <TextArea
          autoFocus={autofocus}
          disabled={disabled}
          id={id}
          invalid={rawErrors && rawErrors.length}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          readOnly={readonly}
          rows={options.rows || 3}
          rowsMax={options.rowsMax || Infinity}
          value={value} />
    );
    /* eslint-enable */
  }
}

export default TextareaWidget;
