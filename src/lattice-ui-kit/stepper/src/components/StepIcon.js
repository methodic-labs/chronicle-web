import { CheckIcon, CircleIcon } from 'lucide-react';

import { IconLayer, StepIndex } from './styled';

import {
  NEUTRAL,
  PURPLE,
  WHITE
} from '../../../colors';

const StepIcon = ({
  active,
  className,
  complete,
  index
}) => (
  <IconLayer className={className}>
    <CircleIcon
        fill={(active || complete) ? PURPLE.P300 : NEUTRAL.N500}
        stroke={(active || complete) ? PURPLE.P300 : NEUTRAL.N500} />
    {
      complete
        ? <CheckIcon stroke={WHITE} />
        : <StepIndex>{index}</StepIndex>
    }
  </IconLayer>
);

StepIcon.defaultProps = {
  className: undefined
};

export default StepIcon;
