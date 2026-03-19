// @flow
import type { ComponentType } from 'react';

type ArrayFieldDescriptionProps = {
  DescriptionField :ComponentType<any>;
  idSchema :{ $id :string };
  description ?:string;
};

const ArrayFieldDescription = ({ DescriptionField, idSchema, description } :ArrayFieldDescriptionProps) => {
  if (!description || !DescriptionField) {
    return null;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
};

ArrayFieldDescription.defaultProps = {
  description: '',
};

export default ArrayFieldDescription;
