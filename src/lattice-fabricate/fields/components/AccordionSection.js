// @flow
import { useState } from 'react';
import type { Node } from 'react';

import { ChevronDownIcon } from 'lucide-react';
import styled from 'styled-components';

import {
  CardSegment,
  // $FlowFixMe
  Collapse,
  IconButton,
  Typography,
} from '../../../lattice-ui-kit';

const HeaderWrapper = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LabelWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 0 1 auto;
`;

const ToggleIcon = styled(ChevronDownIcon)`
  transform: ${(props) => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
`;

export type props = {
  className :?string;
  children :Node;
  title :string;
};

const AccordionSection = ({
  className,
  children,
  title,
} :props) => {
  const [isOpen, setOpen] = useState(true);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <CardSegment className={className} padding="20px 0 0">
      <HeaderWrapper aria-expanded={isOpen ? 'true' : 'false'} onClick={toggleOpen}>
        <LabelWrapper aria-labelledby="accordion-title">
          <Typography id="accordion-title" variant="subtitle2">{title}</Typography>
        </LabelWrapper>
        <IconButton variant="text" size="small">
          <ToggleIcon
              aria-expanded={isOpen ? 'true' : 'false'}
              aria-label={isOpen ? 'Collapse' : 'Expand'}
              onClick={toggleOpen}
              open={isOpen}
              size={16} />
        </IconButton>
      </HeaderWrapper>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </CardSegment>
  );
};

export default AccordionSection;
