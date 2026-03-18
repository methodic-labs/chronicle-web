import toJson from 'enzyme-to-json';
import { mount, shallow } from 'enzyme';
import { CheckIcon, CircleIcon } from 'lucide-react';

import StepIcon from './StepIcon';
import { StepIndex } from './styled';

import { PURPLE } from '../../../colors';

describe('StepIcon', () => {

  describe('default', () => {
    test('should match snapshot', () => {
      const wrapper = mount(<StepIndex index={0} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('active should set color', () => {
      const wrapper = shallow(<StepIcon index={0} active />);
      expect(wrapper.find(CircleIcon).prop('fill')).toBe(PURPLE.P300);
    });

    test('render index + 1', () => {
      const wrapper = shallow(<StepIcon index={0} />);
      expect(wrapper.find(StepIndex).text()).toBe('0');
    });
  });

  describe('complete', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<StepIcon index={0} complete />);
    });

    test('should match snapshot', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('complete should set color', () => {
      expect(wrapper.find(CircleIcon).first().prop('fill')).toBe(PURPLE.P300);
    });

    test('should should render icon instead of index', () => {
      expect(wrapper.find(StepIndex)).toHaveLength(0);
      expect(wrapper.find(CheckIcon)).toBeDefined();
    });

  });

});
