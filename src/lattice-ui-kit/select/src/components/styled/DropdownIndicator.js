/*
 * @flow
 */

import type { ElementConfig } from 'react';

import { components } from 'react-select';

const { DropdownIndicator: RSDropdownIndicator } = components;

type Props = ElementConfig<typeof RSDropdownIndicator>;

const LUKDropdownIndicator = (props :Props) => {

  const { selectProps: { dropdownIcon, icon, hideDropdownIcon } } = props;

  if (hideDropdownIcon) return null;

  if (icon) {
    console.warn('lattice-ui-kit Select: \'icon\' prop is deprecated. Use \'dropdownIcon\' which accepts React.Node.');
  }

  let finalIcon = dropdownIcon || icon;
  if (typeof icon === 'function') {
    finalIcon = icon();
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RSDropdownIndicator {...props}>
      { finalIcon }
    </RSDropdownIndicator>
  );
};

export default LUKDropdownIndicator;
