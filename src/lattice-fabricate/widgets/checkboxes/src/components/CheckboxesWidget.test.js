import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import CheckboxesWidget from './CheckboxesWidget';

import CheckboxWidget from '../../../checkbox/CheckboxWidget';
import Form from '../../../../form';
import { INVALID_PARAMS } from '../../../../utils/testing/Invalid';

const OPTIONS = ['Option 1', 'Option 2', 'Option 3'];
const OTHER_TEXT = 'Custom Other';
const NONE_TEXT = 'Custom None';

const schema = {
  type: 'object',
  title: 'Checkboxes',
  properties: {
    checkboxesOther: {
      title: 'Options (ui:options flag: withOther + otherText)',
      type: 'array',
      description: 'Select all that apply',
      items: {
        type: 'string',
        enum: OPTIONS,
      },
      minItems: 1,
      uniqueItems: true,
    }
  }
};

const createSchema = (options) => ({
  classNames: 'column-span-12',
  checkboxesOther: {
    classNames: 'column-span-12',
    'ui:widget': 'checkboxes',
    'ui:options': {
      withOther: options.withOther || false,
      otherText: options.otherText,
      noneText: options.noneText,
      withNone: options.withNone || false
    }
  }
});

// eslint-disable-next-line react/jsx-props-no-spreading
const MockForm = (props) => <Form schema={schema} uiSchema={createSchema(props)} />;

describe('CheckboxesWidget', () => {
  test('should match snapshot', () => {
    const wrapper = mount(<MockForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('withOther should render Checkboxes with additional Other checkbox input', () => {
    const wrapper = mount(<MockForm otherText={OTHER_TEXT} withOther />);

    expect(wrapper.find(CheckboxWidget)).toHaveLength(OPTIONS.length + 1);

    // last checkbox should have otherText value
    expect(wrapper.find(CheckboxWidget).last().text()).toEqual(OTHER_TEXT);
  });

  test('should pass props to the widget', () => {
    const wrapper = mount(<MockForm otherText={OTHER_TEXT} noneText={NONE_TEXT} withOther withNone />);

    const options = wrapper.find(CheckboxesWidget).prop('options');
    expect(options).toHaveProperty('withOther', true);
    expect(options).toHaveProperty('otherText', OTHER_TEXT);
    expect(options).toHaveProperty('noneText', NONE_TEXT);
    expect(options).toHaveProperty('withNone', true);
  });

  test('when otherText is undefined, last checkbox should be labelled Other', () => {
    const wrapper = mount(<MockForm withOther />);
    expect(wrapper.find(CheckboxWidget).last().text()).toEqual('Other');
  });

  test('should display input text when last checkbox is checked, and hide when unchecked', () => {
    const wrapper = mount(<MockForm withOther />);
    expect(wrapper.find('input[type="text"]')).toHaveLength(0);

    const widget = wrapper.find(CheckboxWidget).last();
    widget.find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
    wrapper.update();
    expect(wrapper.find('input[type="text"]')).toHaveLength(1);
    expect(wrapper.find('input[type="text"]').prop('value')).toEqual('');

    // uncheck
    widget.find('input[type="checkbox"]').simulate('change', { target: { checked: false } });
    wrapper.update();
    expect(wrapper.find('input[type="text"]')).toHaveLength(0);
  });

  test('otherText should be a nonEmptyString string, else default to Other', () => {
    INVALID_PARAMS.forEach((param) => {
      const wrapper = mount(<MockForm withOther otherText={param} />);
      expect(wrapper.find(CheckboxWidget).last().text()).toEqual('Other');
    });
  });

  test('withNone should display an additional checkbox with noneText label', () => {
    const wrapper = mount(<MockForm withNone noneText={NONE_TEXT} />);
    expect(wrapper.find(CheckboxWidget)).toHaveLength(OPTIONS.length + 1);

    expect(wrapper.find(CheckboxWidget).last().text()).toEqual(NONE_TEXT);
  });

  test('when noneText is undefined, last checkbox should be labelled None', () => {
    const wrapper = mount(<MockForm withNone />);
    expect(wrapper.find(CheckboxWidget).last().text()).toEqual('None');
  });

  test('noneText should be a nonEmptyString string, else default to None', () => {
    INVALID_PARAMS.forEach((param) => {
      const wrapper = mount(<MockForm withNone noneText={param} />);
      expect(wrapper.find(CheckboxWidget).last().text()).toEqual('None');
    });
  });

  test('checking none checkbox should unselect every other checkbox', () => {
    const wrapper = mount(<MockForm withNone noneText={NONE_TEXT} />);

    // check all checkboxes except the None one
    const checkboxes = wrapper.find(CheckboxWidget);
    checkboxes.forEach((node) => {
      if (node.text() !== NONE_TEXT) {
        node.find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
      }
    });
    wrapper.update();

    // check the None checkbox. expect the rest to be unchecked
    checkboxes.last().find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
    wrapper.update();

    wrapper.find(CheckboxWidget).forEach((node) => {
      const checkbox = node.find('input[type="checkbox"]');
      if (node.text() !== NONE_TEXT) {
        expect(checkbox.prop('value')).toEqual(false);
      }
      else {
        expect(checkbox.prop('value')).toEqual(true);
      }
    });
  });

  test('None checkbox should be deselected on selecting any other checkbox', () => {
    const wrapper = mount(<MockForm withNone noneText={NONE_TEXT} />);

    // 1: select None checkbox
    wrapper
      .find(CheckboxWidget)
      .last()
      .find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
    wrapper.update();

    expect(wrapper.find(CheckboxWidget).last().find('input[type="checkbox"]').prop('value')).toEqual(true);

    // select first checkbox
    wrapper
      .find(CheckboxWidget)
      .first()
      .find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
    wrapper.update();

    expect(wrapper.find(CheckboxWidget).last().find('input[type="checkbox"]').prop('value')).toEqual(false);
  });
});
