/*
 * @flow
 */

import { useCallback, useEffect, useRef } from 'react';

import SignatureCanvas from 'react-signature-canvas';
import styled from 'styled-components';

import { Button, Colors } from '../../../lattice-ui-kit';
import { DATA_URL_IMG_PNG_PREFIX, tryConvertingToDataURL } from './SignatureUtils';

const { NEUTRALS } = Colors;

const CanvasWrapper = styled.div`
  height: 250px;
  position: relative;

  canvas {
    background-color: ${NEUTRALS[8]};
    border-radius: 3px;
    border: solid 1px ${NEUTRALS[4]};
    height: 100%;
    position: absolute;
    width: 100%;
  }
`;

const ClearButton = styled(Button)`
  color: ${NEUTRALS[1]};
  position: absolute;
  right: 10px;
  top: 10px;
  &:hover {
    color: ${NEUTRALS[0]};
  }
`;

type Props = {
  disabled :boolean;
  onChange :(data :string | void) => void;
  value :?string;
};

const SignatureWidget = (props :Props) => {

  const { disabled, onChange, value } = props;
  const signatureCanvasRef :{ current :?SignatureCanvas } = useRef();

  useEffect(() => {
    const { current } = signatureCanvasRef;
    if (current) {
      if (value) {
        const valueAsDataURL = tryConvertingToDataURL(value);
        current.fromDataURL(valueAsDataURL);
      }
      else {
        current.clear();
      }
    }
  }, [signatureCanvasRef, value]);

  useEffect(() => {
    const { current } = signatureCanvasRef;
    if (current) {
      if (disabled) {
        current.off();
      }
      else {
        current.on();
      }
    }
  }, [disabled, signatureCanvasRef]);

  const handleOnChange = useCallback(() => {
    const { current } = signatureCanvasRef;
    if (current) {
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
      const dataURL :string = current.toDataURL(); // default is "image/png"
      onChange(dataURL.slice(DATA_URL_IMG_PNG_PREFIX.length));
    }
  }, [onChange, signatureCanvasRef]);

  const handleOnClear = useCallback(() => {
    const { current } = signatureCanvasRef;
    if (current) {
      current.clear();
      onChange();
    }
  }, [onChange, signatureCanvasRef]);

  return (
    <CanvasWrapper>
      <SignatureCanvas onEnd={handleOnChange} ref={signatureCanvasRef} />
      <ClearButton disabled={disabled} mode="subtle" onClick={handleOnClear}>Clear</ClearButton>
    </CanvasWrapper>
  );
};

export default SignatureWidget;
