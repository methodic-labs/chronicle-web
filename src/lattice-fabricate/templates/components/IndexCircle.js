// @flow
import styled from 'styled-components';

import { StepIcon } from '../../../lattice-ui-kit';

const IconLayer = styled.span`
  visibility: ${(props) => !props.visible && 'hidden'};
  margin: 5px 0;
`;

type Props = {
  index :number;
  visible ?:boolean;
};

const IndexCircle = ({ index, visible } :Props) => (
  <IconLayer visible={visible}>
    <StepIcon index={index} active />
  </IconLayer>
);

IndexCircle.defaultProps = {
  visible: true
};

export default IndexCircle;
