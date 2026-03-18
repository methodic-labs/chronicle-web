import { mount } from 'enzyme';

import FormContainer from '../../stories/FormContainer';

describe('Form', () => {

  describe('integration', () => {
    test('should render a form', () => {
      const mockSubmit = jest.fn();
      const wrapper = mount(<FormContainer onSubmit={mockSubmit} />);
      expect(wrapper.find('form')).toHaveLength(1);
    });

    test('"submit" event should trigger onSubmit', () => {
      const mockSubmit = jest.fn();
      const wrapper = mount(<FormContainer onSubmit={mockSubmit} />);
      wrapper.find('form').simulate('submit');
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
