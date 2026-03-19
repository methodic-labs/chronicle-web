// @flow
/* eslint-disable no-underscore-dangle */

import { Component } from 'react';
import type { Ref } from 'react';

import Form from '@rjsf/core';
import styled from 'styled-components';
import { isFunction } from 'lodash';

import AccordionSection from './components/AccordionSection';
import AttachmentItem from './components/AttachmentItem';
import FileUpload from './components/FileUpload';

import { List } from '../../lattice-ui-kit';
import { getCurrentFormData } from '../form/src/components/PageUtils';
import type { UUID } from '../types';

const StyledAccordionSection = styled(AccordionSection)`
  grid-row-start: 2;
`;

type OnDrop = (
  fieldId :string,
  file :Object,
  formData :Object,
) => void;

type OnDeleteAttachment = (
  attachment :Object,
  formData :Object
) => void;

type Attachment = {
  date :string;
  fieldId :string;
  href :string;
  id :UUID; // entity key id of file
  name :string;
  type :string;
};

type Attachments = {
  [fieldId :string] :Attachment[];
}

type FormContext = {
  attachments :Attachments;
  formRef :Ref<Form>;
  onDeleteAttachment :OnDeleteAttachment;
  onDrop :OnDrop;
};

type Props = {
  disabled :boolean;
  formContext :FormContext;
  formData :Object;
  uiSchema :Object;
}

class AttachmentsField extends Component<Props> {

  handleDrop = ({ file } :{ file :any }) => {
    const { formContext, formData } = this.props;
    const { onDrop, formRef } = formContext;
    const { _id } = formData;
    const currentFormData = getCurrentFormData(formRef);
    if (isFunction(onDrop)) {
      onDrop(
        file,
        _id,
        currentFormData,
      );
    }
    else {
      console.error('formContext.onDrop is not a function');
    }
  }

  onDelete = (attachment :Object) => {
    const { formContext } = this.props;
    const { onDeleteAttachment, formRef } = formContext;
    if (isFunction(onDeleteAttachment)) {
      const currentFormData = getCurrentFormData(formRef);
      onDeleteAttachment(attachment, currentFormData);
    }
    else {
      console.error('formContext.onDeleteAttachment is not a function');
    }
  };

  render() {
    const {
      disabled,
      formContext,
      formData,
      uiSchema,
    } = this.props;
    const { attachments = {} } = formContext;
    const { _id } = formData;
    const { accept } = uiSchema['ui:options'] || {};
    const fieldAttachments = attachments[_id] || [];
    const count = fieldAttachments.length;
    const title = count ? `Attachments (${count})` : 'Attachments';

    return (
      <StyledAccordionSection title={title}>
        <FileUpload disabled={disabled} accept={accept} onChange={this.handleDrop} />
        <List dense>
          {
            fieldAttachments.map((attachment, index) => {
              const hasDivider = index !== fieldAttachments.length - 1;
              return (
                <AttachmentItem
                    divider={hasDivider}
                    file={attachment}
                    key={`document-${attachment.id}`}
                    onDelete={this.onDelete} />
              );
            })
          }
        </List>
      </StyledAccordionSection>
    );
  }
}

export default AttachmentsField;
