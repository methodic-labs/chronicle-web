// @flow
import { mount } from 'enzyme';

import CustomSchemaField from './SchemaField';

import ConfirmDeleteModal from '../templates/array/components/ConfirmDeleteModal';
import Form from '../form';
import IconButton from '../templates/components/IconButton';

const arraySchema = {
  type: 'array',
  title: 'Array',
  items: {
    type: 'string',
    title: 'string item'
  },
  default: ['']
};

const fixedArraySchema = {
  type: 'array',
  title: 'Array',
  items: [{
    type: 'string',
    title: 'string item'
  }],
  default: ['']
};

const unremoveableSchema = {
  type: 'array',
  title: 'Array',
  items: [{
    type: 'string',
    title: 'string item'
  }],
  default: ['']
};

const unremoveableUiSchema = {
  items: {
    'ui:options': {
      removable: false
    }
  }
};

const readonlyUiSchema = { ...unremoveableUiSchema, 'ui:readonly': true };

describe('SchemaField', () => {

  describe('default', () => {
    test('should show add/delete action for array schemas', () => {
      const wrapper = mount(<Form schema={arraySchema} />);
      const arraySchemaField = wrapper.find(CustomSchemaField).filter({ hasRemove: true });
      expect(arraySchemaField).toHaveLength(1);
      expect(arraySchemaField.children().find('button')).toHaveLength(1);
      expect(arraySchemaField.children().find(ConfirmDeleteModal)).toHaveLength(1);
    });

    test('should not show add/delete action for fixed array schemas', () => {
      const wrapper = mount(<Form schema={fixedArraySchema} />);
      const deleteButtons = wrapper.find(IconButton);
      expect(deleteButtons).toHaveLength(0);
    });

    test('should not show add/delete action for unremovable ui schemas', () => {
      const wrapper = mount(<Form schema={unremoveableSchema} uiSchema={unremoveableUiSchema} />);
      const deleteButtons = wrapper.find(IconButton);
      expect(deleteButtons).toHaveLength(0);
    });
  });

  describe('readonly', () => {

    test('should not show add/delete action for readonly array schemas', () => {
      const wrapper = mount(<Form schema={arraySchema} uiSchema={readonlyUiSchema} />);
      const arraySchemaField = wrapper.find(CustomSchemaField).filter({ hasRemove: true });
      expect(arraySchemaField).toHaveLength(1);
      expect(arraySchemaField).toHaveLength(1);
      expect(arraySchemaField.children().filter('button')).toHaveLength(0);
      expect(arraySchemaField.children().find(ConfirmDeleteModal)).toHaveLength(0);
    });
  });
});
