// @flow
import { Component } from 'react';

import { Checkbox } from '../../../lattice-ui-kit';
import KeyCodes from '../constants/KeyCodes';
import type { WidgetProps } from '../types';

type Props = WidgetProps & {
  label :string;
  mode :string;
};

class CheckboxWidget extends Component <Props> {

  onKeyDown = (e :SyntheticKeyboardEvent<*>) => {
    if (e.key === KeyCodes.ENTER) {
      e.preventDefault();
    }
  }

  onChange = (e :SyntheticInputEvent<*>) => {
    const { onChange } = this.props;
    const { checked } = e.target;
    onChange(checked);
  }

  render() {
    const {
      autofocus,
      disabled,
      id,
      label,
      mode,
      readonly,
      required,
      value,
    } = this.props;

    return (
      <Checkbox
          autoFocus={autofocus}
          checked={typeof value === 'undefined' ? false : value}
          disabled={disabled || readonly}
          id={id}
          label={label}
          mode={mode}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          required={required}
          type="checkbox"
          value={value} />
    );
  }
}

export default CheckboxWidget;
