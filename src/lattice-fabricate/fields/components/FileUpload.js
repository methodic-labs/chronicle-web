// @flow
import { useCallback } from 'react';

import Dropzone from './Dropzone';

type Props = {
  accept ?:string;
  disabled ?:boolean;
  onChange :Function
}

const FileUpload = ({
  accept,
  disabled,
  onChange
} :Props) => {
  const handleChange = useCallback((args) => onChange(args), [onChange]);

  const onDrop = (files) => {
    files.forEach((file) => {
      const { name, type } = file;
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result;
        handleChange({
          file: {
            base64,
            name,
            type
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Dropzone accept={accept} disabled={disabled} onDrop={onDrop} />
  );
};

FileUpload.defaultProps = {
  accept: undefined,
  disabled: false,
};

export default FileUpload;
