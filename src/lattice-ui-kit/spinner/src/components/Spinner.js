import styled, { keyframes } from 'styled-components';

import { NEUTRAL } from '../../../colors';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const CssSpinner = styled.span`
  align-self: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  animation: ${rotate} 750ms linear infinite;
  border: 2px solid ${({ colorBottom }) => (colorBottom || NEUTRAL.N300)};
  border-bottom-color: ${({ colorTop }) => (colorTop || NEUTRAL.N700)};
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
`;

const SizeMap = {
  xs: 12,
  sm: 14,
  lg: 20,
  xl: 24,
  '1x': 16,
  '2x': 32,
  '3x': 48,
  '4x': 64,
};

const Spinner = (props) => {
  const {
    bottomColor,
    centered,
    size,
    topColor,
  } = props;

  let pixels = 16;
  if (size in SizeMap) {
    pixels = SizeMap[size];
  }
  else if (typeof size === 'number') {
    pixels = size;
  }

  return (
    <CssSpinner
        centered={typeof centered === 'boolean' ? centered : true}
        colorBottom={bottomColor}
        colorTop={topColor}
        size={pixels} />
  );
};

export default Spinner;
