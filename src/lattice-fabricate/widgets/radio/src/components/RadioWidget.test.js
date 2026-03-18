import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import RadioWidget from './RadioWidget';

import Form from '../../../../form';

const OPTION_ENUMS = ['Option 1', 'Option 2', 'Option 3'];
const schema = {
  type: 'object',
  title: 'radio',
  properties: {
    radio: {
      title: 'ui:widget: OtherRadioWidget',
      type: 'string',
      enum: OPTION_ENUMS,
    },
  },
};

const uiSchema = {
  classNames: 'column-span-12',
  radio: {
    classNames: 'column-span-12',
    'ui:widget': 'radio',
    'ui:options': {
      withNone: true,
      withOther: true,
    },
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
const MockForm = (props) => <Form schema={schema} uiSchema={uiSchema} {...props} />;

describe('RadioWidget', () => {

  test('should render', () => {
    const wrapper = mount(<MockForm />);
    expect(wrapper.find(RadioWidget)).toHaveLength(1);
  });

  test('should match snapshot', () => {
    const wrapper = mount(<MockForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should prevent default on enter', () => {
    const mockPreventDefault = jest.fn();
    const wrapper = mount(<MockForm />);

    const radioWrapper = wrapper.find('input[type="radio"]').at(0);
    radioWrapper.simulate('keyDown', {
      preventDefault: mockPreventDefault,
      key: 'Space'
    });
    expect(mockPreventDefault).toHaveBeenCalledTimes(0);
    wrapper.update();

    radioWrapper.simulate('keyDown', {
      preventDefault: mockPreventDefault,
      key: 'Enter'
    });
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
  });
});
