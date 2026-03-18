import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import { LatticeLuxonUtils, MuiPickersUtilsProvider } from '../../../lattice-ui-kit';
import DateWidget from './DateWidget';
import Form from '../../form';

const schema = {
  type: 'object',
  title: 'dateWidget',
  properties: {
    dateWidget: {
      title: 'ui:widget: DateWidget',
      type: 'string',
    },
  },
};

const uiSchema = {
  classNames: 'column-span-12',
  dateWidget: {
    classNames: 'column-span-12',
    'ui:widget': 'DateWidget',
    'ui:options': {
      format: 'yyyy/MM/dd',
      mask: '____/__/__',
      placeholder: 'YYYY/MM/DD'
    },
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
const MockForm = (props) => <Form schema={schema} uiSchema={uiSchema} {...props} />;

describe('DateWidget', () => {

  test('should render', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    expect(wrapper.find(DateWidget)).toHaveLength(1);
  });

  test('should match snapshot', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should have be able to take a custom format', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const dateWidget = wrapper.find(DateWidget).at(0);
    const { options } = dateWidget.props();
    expect(options.format).toEqual('yyyy/MM/dd');
  });

  test('should be able to take a custom mask', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const dateWidget = wrapper.find(DateWidget).at(0);
    const { options } = dateWidget.props();
    expect(options.mask).toEqual('____/__/__');
  });

  test('should be able to take a custom placeholder', () => {
    const wrapper = mount(<MuiPickersUtilsProvider utils={LatticeLuxonUtils}><MockForm /></MuiPickersUtilsProvider>);
    const dateWidget = wrapper.find(DateWidget).at(0);
    const { placeholder } = dateWidget.props();
    expect(placeholder).toEqual('YYYY/MM/DD');
  });
});
