/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import { Colors, Typography } from '../../../lattice-ui-kit';

const {
  BLUE,
  NEUTRAL,
  PURPLE,
  RED,
} = Colors;

const getColor = (props) => {
  if (props.isDragAccept) {
    return PURPLE.P300;
  }
  if (props.isDragReject) {
    return RED.R300;
  }
  if (props.isDragActive) {
    return BLUE.B300;
  }
  return NEUTRAL.N100;
};

const DropzoneWrapper = styled.div`
  align-items: center;
  background-color: ${NEUTRAL.N00};
  border-color: ${(props) => getColor(props)};
  border-radius: 3px;
  border-style: dashed;
  border-width: 2px;
  display: flex;
  flex-direction: column;
  flex: 1;
  outline: none;
  padding: 16px;
  transition: border 250ms ease-in-out;
`;

type Props = {
  accept ?:string;
  disabled ?:boolean;
  onDrop :Function;
};

const Dropzone = (props :Props) => {
  const { accept, disabled, onDrop } = props;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept,
    disabled,
    onDrop,
  });

  const {
    onBlur,
    onClick,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop: onDropRoot,
    onFocus,
    onKeyDown,
    ref,
    tabIndex
  } = getRootProps();

  const {
    accept: acceptInput,
    autoComplete,
    multiple,
    onChange,
    onClick: onClickInput,
    ref: refInput,
    style,
    tabIndex: tabIndexInput,
    type,
  } = getInputProps();

  return (
    <DropzoneWrapper
        isDragActive={isDragActive}
        isDragAccept={isDragAccept}
        isDragReject={isDragReject}
        onBlur={onBlur}
        onClick={onClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDropRoot}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        ref={ref}
        tabIndex={tabIndex}>
      <input
          accept={acceptInput}
          aria-labelledby="dropzone"
          autoComplete={autoComplete}
          multiple={multiple}
          onChange={onChange}
          onClick={onClickInput}
          ref={refInput}
          style={style}
          tabIndex={tabIndexInput}
          type={type} />
      <Typography component="span" id="dropzone">Drop files here or click to select.</Typography>
    </DropzoneWrapper>
  );
};

Dropzone.defaultProps = {
  accept: undefined,
  disabled: false,
};

export default Dropzone;
