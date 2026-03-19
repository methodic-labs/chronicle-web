import { forwardRef } from 'react';

import { InputAdornment, TextField } from '@material-ui/core';
import { SearchIcon } from 'lucide-react';

const SearchIconAdornment = (
  <InputAdornment position="start">
    <SearchIcon size={16} />
  </InputAdornment>
);

const SearchInput = forwardRef((props, ref) => {

  const {
    fullWidth = true,
    type = 'text',
    variant,
    ...other
  } = props;

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <TextField
        {...other} // eslint-disable-line indent
        InputProps={{ startAdornment: SearchIconAdornment }}
        fullWidth={fullWidth}
        ref={ref}
        type={type}
        variant="outlined" />
  );
  /* eslint-enable */
});

export default SearchInput;
