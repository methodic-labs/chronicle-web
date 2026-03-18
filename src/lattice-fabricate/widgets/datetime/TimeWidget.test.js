import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import { LatticeLuxonUtils, MuiPickersUtilsProvider } from '../../../lattice-ui-kit';
import TimeWidget from './TimeWidget';
import Form from '../../form';

const schema = {
  type: 'object',
  title: 'timeWidget',
  properties: {
    timeWidget: {
      title: 'ui:widget: TimeWidget',
      type: 'string',
    },
  },
};

const uiSchema = {
  classNames: 'column-span-12',
  timeWidget: {
    classNames: 'column-span-12',
    'ui:widget': 'TimeWidget',
    'ui:options': {
      ampm: false,
      format: 'HH:mm',
      mask: '__:__',
      placeholder: 'HH:MM'
    },
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
const MockForm = (props) => <Form schema={schema} uiSchema={uiSchema} {...props} />;

describe('TimeWidget', () => {

  test('should render', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    expect(wrapper.find(TimeWidget)).toHaveLength(1);
  });

  test('should match snapshot', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should be able to set ampm to true or false', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const timeWidget = wrapper.find(TimeWidget).at(0);
    const { options } = timeWidget.props();
    expect(options.ampm).toEqual(false);
  });

  test('should have be able to take a custom format', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const timeWidget = wrapper.find(TimeWidget).at(0);
    const { options } = timeWidget.props();
    expect(options.format).toEqual('HH:mm');
  });

  test('should be able to take a custom mask', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const timeWidget = wrapper.find(TimeWidget).at(0);
    const { options } = timeWidget.props();
    expect(options.mask).toEqual('__:__');
  });

  test('should be able to take a custom placeholder', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const timeWidget = wrapper.find(TimeWidget).at(0);
    const { placeholder } = timeWidget.props();
    expect(placeholder).toEqual('HH:MM');
  });
});
