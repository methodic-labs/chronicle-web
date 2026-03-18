import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import { MarkdownEditor } from '../../../lattice-ui-kit';
import Form from '../../form';
import MarkdownEditorWidget from './MarkdownEditorWidget';

const schema = {
  type: 'object',
  title: 'markdown',
  properties: {
    markdownWidget: {
      title: 'ui:widget: MarkdownEditorWidget',
      type: 'string',
    },
  },
};

const uiSchema = {
  classNames: 'column-span-12',
  markdownWidget: {
    classNames: 'column-span-12',
    'ui:widget': 'MarkdownEditorWidget',
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
const MockForm = (props) => <Form schema={schema} uiSchema={uiSchema} {...props} />;

describe('MarkdownEditorWidget', () => {

  test('should match snapshot', () => {
    const wrapper = mount(<MockForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('mock form should render MarkdownEditorWidget', () => {
    const wrapper = mount(<MockForm />);
    expect(wrapper.find(MarkdownEditorWidget)).toHaveLength(1);
  });

  test('should render MarkdownEditor', () => {
    const wrapper = mount(<MockForm />);
    expect(wrapper.find(MarkdownEditor)).toHaveLength(1);
  });

  test('should invoke onChange', () => {
    const mockOnChange = jest.fn();
    const wrapper = mount(<MockForm onChange={mockOnChange} />);
    const editorArea = wrapper.find(MarkdownEditor).find('textarea');

    expect(editorArea).toHaveLength(1);
    // RJSF Form constructor calls onChange with initial state
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    editorArea.invoke('onChange')({
      currentTarget: { value: 'test' },
      target: { value: 'test' }
    });
    expect(mockOnChange.mock.calls[1][0].formData).toEqual({ markdownWidget: 'test' });
  });

  test('should invoke onBlur', () => {
    const mockOnBlur = jest.fn();
    const wrapper = mount(<MockForm onBlur={mockOnBlur} />);
    const editorArea = wrapper.find(MarkdownEditor).find('textarea');
    expect(wrapper.find(MarkdownEditor)).toHaveLength(1);
    expect(mockOnBlur).toHaveBeenCalledTimes(0);
    editorArea.invoke('onBlur')({
      currentTarget: { value: 'test' },
      target: { value: 'test' }
    });
    expect(mockOnBlur.mock.calls[0]).toEqual(['root_markdownWidget', 'test']);
  });

  test('should invoke onFocus', () => {
    const mockOnFocus = jest.fn();
    const wrapper = mount(<MockForm onFocus={mockOnFocus} />);
    const editorArea = wrapper.find(MarkdownEditor).find('textarea');
    expect(wrapper.find(MarkdownEditor)).toHaveLength(1);
    expect(mockOnFocus).toHaveBeenCalledTimes(0);
    editorArea.invoke('onFocus')({
      currentTarget: { value: 'test' },
      target: { value: 'test' }
    });
    expect(mockOnFocus.mock.calls[0]).toEqual(['root_markdownWidget', 'test']);
  });
});
