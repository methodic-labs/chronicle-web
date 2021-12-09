// @flow
import { memo } from 'react';

import { BasicTooltip } from '@nivo/tooltip';
import { Typography } from 'lattice-ui-kit';
import { DateTime } from 'luxon';

type LinePointTooltipProps = {
  point :{
    data :{
      x :Date;
      y :number;
    },
    serieColor :string;
  };
};

const LinePointTooltip = ({ point } :LinePointTooltipProps) => {

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

export default memo<LinePointTooltipProps>(LinePointTooltip);
