import { BasicTooltip } from '@nivo/tooltip';
import { DateTime } from 'luxon';
import { memo } from 'react';

import { Typography } from '../../../lattice-ui-kit';

const LinePointTooltip = ({ point }) => {

  const { data, serieColor } = point;
  const date = DateTime.fromJSDate(data.x);
  const formattedDate = date.toLocaleString(DateTime.DATE_MED);
  const content = (
    <span>
      <strong>{`${data.y} `}</strong>
      <Typography component="span" color="textSecondary">{formattedDate}</Typography>
    </span>
  );
  return (
    <BasicTooltip
        id={content}
        enableChip
        color={serieColor} />
  );
};

export default memo(LinePointTooltip);
