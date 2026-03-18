import { mount } from 'enzyme';

import Form from '../../form';

const arraySchema = {
  type: 'array',
  title: 'Array',
  items: {
    type: 'string',
    title: 'string item'
  },
  default: ['']
};

const readonlyUiSchema = {
  'ui:readonly': true
};

describe('ArrayFieldTemplate', () => {
  describe('default', () => {
    test('should display add button', () => {
      const wrapper = mount(<Form schema={arraySchema} />);
      expect(wrapper.find('button#add-array-item-button-root')).toHaveLength(1);
    });
  });

  describe('readonly', () => {
    test('should not display add button when readonly', () => {
      const wrapper = mount(<Form schema={arraySchema} uiSchema={readonlyUiSchema} />);
      expect(wrapper.find('button#add-array-item-button-root')).toHaveLength(0);
    });
  });
});
