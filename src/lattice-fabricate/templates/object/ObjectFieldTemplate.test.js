import { mount } from 'enzyme';

import Form from '../../form';

const objectSchema = {
  type: 'object',
  properties: {
    object: {
      type: 'string',
      title: 'string item'
    }
  },
};

const uiSchema = {
  'ui:options': {
    editable: true
  }
};

const readonlyUiSchema = {
  'ui:readonly': true,
  'ui:options': {
    editable: true
  }
};

describe('ObjectFieldTemplate', () => {
  describe('editable', () => {
    test('should display edit button when disabled and editable', () => {
      const wrapper = mount(<Form disabled schema={objectSchema} uiSchema={uiSchema} />);
      expect(wrapper.find('button#edit-button-root')).toHaveLength(1);
    });
  });

  describe('readonly', () => {
    test('should not display edit button when readonly', () => {
      const wrapper = mount(<Form disabled schema={objectSchema} uiSchema={readonlyUiSchema} />);
      expect(wrapper.find('button#edit-button-root')).toHaveLength(0);
    });
  });
});
