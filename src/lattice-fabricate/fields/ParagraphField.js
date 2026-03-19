// @flow

import styled from 'styled-components';

import { isNonEmptyString } from '../utils/LangUtils';

const ParagraphWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
`;

const ParagraphTitle = styled.h2`
  font-size: 16px;
  font-weight: normal;
  margin: 16px 0 0 0;
`;

const ParagraphBody = styled.div`
  font-size: 14px;
  margin: 12px 0 0 0;
`;

type Props = {
  formData :string;
  idSchema :Object;
  schema :Object;
};

const ParagraphField = ({ formData, idSchema, schema } :Props) => (
  <ParagraphWrapper>
    {
      isNonEmptyString(schema.title) && (
        <ParagraphTitle id={`${idSchema.$id}_title`}>
          {schema.title}
        </ParagraphTitle>
      )
    }
    {
      isNonEmptyString(formData) && (
        <ParagraphBody id={`${idSchema.$id}_description`}>
          {formData}
        </ParagraphBody>
      )
    }
  </ParagraphWrapper>
);

export default ParagraphField;
