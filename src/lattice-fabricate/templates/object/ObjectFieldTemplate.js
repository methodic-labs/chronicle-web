// @flow
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { Component, cloneElement } from 'react';
import type { ComponentType } from 'react';

import isFunction from 'lodash/isFunction';
import { utils } from '@rjsf/core';
import { fromJS, set } from 'immutable';
import { PencilIcon } from 'lucide-react';

import { Button } from '../../../lattice-ui-kit';
import { generateId, parseIdIndex } from './utils';
import ActionGutter from '../components/styled/ActionGutter';
import DefaultAttachmentsField from '../../fields/AttachmentsField';
import IconButton from '../components/IconButton';
import { ActionGroup } from '../../form/src/components/styled';
import {
  findEntityAddressKeyFromMap,
  parseIdSchemaPath,
  processEntityDataForPartialReplace,
  replaceEntityAddressKeys,
  wrapFormDataInPageSection,
} from '../../utils/DataProcessingUtils';

const { getUiOptions } = utils;

type Props = {
  DescriptionField :ComponentType<any>;
  TitleField :ComponentType<any>;
  description :string;
  disabled :boolean;
  formContext :Object;
  formData :Object;
  idSchema :Object;
  properties :Object[];
  readonly :boolean;
  registry :Object;
  required :string;
  schema :Object;
  title :string;
  uiSchema :Object;
};

type State = {
  draftFormData :Object;
  isEditing :boolean;
  fieldId :string;
}

class ObjectFieldTemplate extends Component<Props, State> {

  constructor(props :Props) {
    super(props);
    const { schema } = this.props;
    this.state = {
      draftFormData: {},
      isEditing: false,
      fieldId: schema._id,
    };
  }

  componentDidMount() {
    this.setFieldId();
  }

  componentDidUpdate(prevProps :Props) {
    const { formData } = this.props;
    const { formData: prevFormData } = prevProps;
    if (formData !== prevFormData) {
      this.disableFields();
    }
  }

  setFieldId = () => {
    const { schema, formData } = this.props;
    const { fieldId } = this.state;
    if (schema.attachments || schema.comments) {
      if (!formData._id) {
        this.setState({ fieldId: generateId() });
      }
      else if (!fieldId) {
        this.setState({ fieldId: formData._id });
      }
    }
  }

  enableFields = () => {
    const { formData } = this.props;
    this.setState({
      isEditing: true,
      // deep copy formData
      draftFormData: fromJS(formData).toJS()
    });
  }

  disableFields = () => {
    this.setState({
      isEditing: false,
      draftFormData: {}
    });
  }

  renderTitleField = () => {
    const {
      uiSchema,
      title,
      TitleField,
      idSchema,
      required,
    } = this.props;
    if (uiSchema['ui:title'] || title) {
      // Title field renders 'legend'
      return (
        <TitleField
            id={`${idSchema.$id}__title`}
            title={title || uiSchema['ui:title']}
            required={required} />
      );
    }
    return null;
  }

  renderDescriptionField = () => {
    const { description, DescriptionField, idSchema } = this.props;
    if (description) {
      return (
        <DescriptionField
            id={`${idSchema.$id}__description`}
            description={description} />
      );
    }

    return null;
  }

  renderActionGutter = () => {
    const {
      disabled,
      idSchema,
      readonly,
      uiSchema,
    } = this.props;
    const { $id } = idSchema;
    const { isEditing } = this.state;
    const { editable } :Object = getUiOptions(uiSchema);

    return (editable && disabled && !readonly)
      ? (
        <ActionGutter>
          <IconButton
              id={`edit-button-${$id}`}
              icon={<PencilIcon size={16} />}
              onClick={this.enableFields}
              disabled={isEditing} />
        </ActionGutter>
      )
      : null;
  }

  commitDraftFormData = () => {
    const { draftFormData } = this.state;
    const { formData, formContext, idSchema } = this.props;
    const {
      editAction,
      entityIndexToIdMap,
      entitySetIds,
      mappers,
      propertyTypeIds,
    } = formContext;

    // get array index if relevant
    const arrayIndex = parseIdIndex(idSchema);
    const path = parseIdSchemaPath(idSchema);

    // wrap formData in pageSection
    const formattedData = wrapFormDataInPageSection(draftFormData);
    const formattedOriginal = wrapFormDataInPageSection(formData);

    // replace address keys with entityKeyId
    const draftWithKeys = replaceEntityAddressKeys(
      formattedData,
      findEntityAddressKeyFromMap(entityIndexToIdMap, arrayIndex)
    );

    const standardWithKeys = replaceEntityAddressKeys(
      formattedOriginal,
      findEntityAddressKeyFromMap(entityIndexToIdMap, arrayIndex)
    );

    // process for partial replace
    const editedEntityData = processEntityDataForPartialReplace(
      draftWithKeys,
      standardWithKeys,
      entitySetIds,
      propertyTypeIds,
      mappers
    );

    if (isFunction(editAction)) {
      editAction({
        entityData: editedEntityData,
        formData: formattedData,
        path,
        properties: draftFormData,
      });
      this.disableFields();
    }

  };

  renderActionSection = () => {
    const { isEditing } = this.state;
    const { formContext } = this.props;
    const { updateState } = formContext;

    return isEditing && (
      <ActionGroup className="column-span-12" noPadding>
        <Button
            isLoading={updateState}
            color="primary"
            onClick={this.commitDraftFormData}>
          Save
        </Button>
        <Button onClick={this.disableFields}>Discard</Button>
      </ActionGroup>
    );
  }

  createDraftChangeHandler = (name :string) => (value :any) => {
    const { draftFormData } = this.state;
    this.setState({
      draftFormData: set(draftFormData, name, value)
    });
  }

  render() {
    const {
      disabled,
      formData,
      properties,
      schema,
      uiSchema,
      registry,
    } = this.props;
    const { isEditing, draftFormData, fieldId } = this.state;
    const { editable } :Object = getUiOptions(uiSchema);

    if (fieldId) {
      formData._id = fieldId;
    }

    const { AttachmentsField = DefaultAttachmentsField } = registry.fields;

    return (
      <>
        <div>
          { this.renderTitleField() }
          { this.renderDescriptionField() }
          {properties.map((property) => {
            const { content } = property;
            const { props: contentProps } = content;
            const contentName = contentProps.name;

            let state = contentProps;

            if (editable && isEditing) {
              const tempFormData = draftFormData[contentName];
              // inject override props to children
              state = {
                ...contentProps,
                disabled: disabled && !isEditing,
                formData: tempFormData,
                onChange: this.createDraftChangeHandler(contentName),
              };
              return cloneElement(content, state);
            }
            return content;
          })}
          { this.renderActionSection() }
        </div>
        { this.renderActionGutter() }
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        { schema.attachments && <AttachmentsField {...this.props} /> }
      </>
    );
  }
}

export default ObjectFieldTemplate;
