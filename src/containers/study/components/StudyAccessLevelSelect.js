import { MenuItem, TextField } from '../../../lattice-ui-kit';
import { ACCESS_LEVEL_OPTIONS } from '../constants/studyAccess';

const StudyAccessLevelSelect = ({
  disabled,
  id,
  label,
  onChange,
  value,
}) => (
  <TextField
      SelectProps={{ renderValue: (selected) => ACCESS_LEVEL_OPTIONS.find((o) => o.value === selected)?.label }}
      disabled={disabled}
      id={id}
      label={label}
      onChange={(event) => onChange(event.target.value)}
      select
      size="small"
      value={value}
      variant="outlined">
    {
      ACCESS_LEVEL_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          { option.label }
          {' — '}
          { option.description }
        </MenuItem>
      ))
    }
  </TextField>
);

StudyAccessLevelSelect.defaultProps = {
  disabled: false,
  label: undefined,
};

export default StudyAccessLevelSelect;
