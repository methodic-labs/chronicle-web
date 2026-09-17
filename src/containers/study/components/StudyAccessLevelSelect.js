import {
  Box,
  MenuItem,
  TextField,
  Typography,
} from '../../../lattice-ui-kit';
import { ACCESS_LEVEL_OPTIONS } from '../constants/studyAccess';

const StudyAccessLevelSelect = ({
  disabled,
  id,
  label,
  onChange,
  value,
}) => {

  const labelId = `${id}-label`;

  return (
    <Box>
      {
        /*
         * Rendered above the field rather than passed to TextField as its own label. An outlined MUI v4 select at
         * size="small" applies the dense shrink transform to the label but not to the notch it sits in, so the label
         * ends up overlapping the top of the control. A plain label above the field has nothing to overlap.
         */
        label && (
          <Typography
              color="textSecondary"
              component="label"
              display="block"
              gutterBottom
              htmlFor={id}
              id={labelId}
              variant="body2">
            { label }
          </Typography>
        )
      }
      <TextField
          SelectProps={{
            // Select composes its own aria-labelledby from labelId + the input id, so the association has to go
            // through labelId rather than an aria-labelledby we pass ourselves, which it would overwrite.
            labelId: label ? labelId : undefined,
            renderValue: (selected) => ACCESS_LEVEL_OPTIONS.find((o) => o.value === selected)?.label,
          }}
          disabled={disabled}
          id={id}
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
    </Box>
  );
};

StudyAccessLevelSelect.defaultProps = {
  disabled: false,
  label: undefined,
};

export default StudyAccessLevelSelect;
