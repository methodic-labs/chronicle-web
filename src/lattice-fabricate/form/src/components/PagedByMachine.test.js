// @flow
import { mount } from 'enzyme';

import Form from './Form';
import PagedByMachine from './PagedByMachine';

import { pageMachine } from '../../stories/constants/pageMachine';
import { xschemas, xuiSchemas } from '../../stories/constants/pagedSchemas';

const mockRender = ({
  formRef,
  pagedData,
  page,
  onBack,
  onNext,
  validateAndSubmit,
} :any) => (
  <>
    <Form
        formData={pagedData}
        hideSubmit
        ref={formRef}
        onSubmit={onNext}
        schema={xschemas[page]}
        uiSchema={xuiSchemas[page]} />
    <button
        id="back-button"
        type="button"
        onClick={onBack}>
      Back
    </button>
    <button
        id="next-button"
        type="submit"
        onClick={validateAndSubmit}>
      Next
    </button>
  </>
);

describe('PagedByMachine', () => {

  describe('render', () => {
    test('should invoke render prop', () => {
      const wrapper = mount(<PagedByMachine machine={pageMachine} render={mockRender} />);
      expect(wrapper.find(Form)).toHaveLength(1);
    });
  });

  describe('page', () => {
    test('should default to initial page', () => {
      const { initial } = pageMachine.config;
      const wrapper = mount(<PagedByMachine machine={pageMachine} render={mockRender} />);
      expect(wrapper.find(Form).props().schema).toEqual(xschemas[initial]);
      expect(wrapper.find(Form).props().uiSchema).toEqual(xuiSchemas[initial]);
    });

    test('should change page schema', () => {
      const { initial } = pageMachine.config;
      const wrapper = mount(
        <PagedByMachine
            machine={pageMachine}
            render={mockRender} />
      );
      expect(wrapper.find(Form).props().schema).toEqual(xschemas[initial]);
      expect(wrapper.find(Form).props().uiSchema).toEqual(xuiSchemas[initial]);

      wrapper.find('input#root_section1_name').props().onChange({ currentTarget: { value: 'name' } });
      wrapper.find('#next-button').simulate('click');

      expect(wrapper.find(Form).props().schema).toEqual(xschemas.page2);
      expect(wrapper.find(Form).props().uiSchema).toEqual(xuiSchemas.page2);
    });
  });

  describe('validateAndSubmit', () => {
    test('should trigger form validation before proceeding', () => {
      const { initial } = pageMachine.config;
      const mockOnPageChange = jest.fn();
      const wrapper = mount(
        <PagedByMachine
            machine={pageMachine}
            onPageChange={mockOnPageChange}
            render={mockRender} />
      );

      wrapper.find('#next-button').simulate('click');
      wrapper.update();

      expect(mockOnPageChange).toHaveBeenLastCalledWith(initial, undefined);
      expect(wrapper.find('.has-error')).toHaveLength(1);

      wrapper.find('input#root_section1_name').props().onChange({ currentTarget: { value: 'name' } });
      wrapper.find('#next-button').simulate('click');

      expect(wrapper.find('textarea')).toHaveLength(2);
      expect(mockOnPageChange)
        .toHaveBeenLastCalledWith('page2', expect.objectContaining({ section1: { name: 'name' } }));
    });
  });

  describe('onNext/onBack', () => {
    test('should call onPageChange with new page number and formData', () => {
      const mockOnPageChange = jest.fn();
      const wrapper = mount(
        <PagedByMachine
            machine={pageMachine}
            onPageChange={mockOnPageChange}
            render={mockRender} />
      );

      wrapper.find('input#root_section1_name').props().onChange({ currentTarget: { value: 'name' } });
      wrapper.find('#next-button').simulate('click');
      expect(mockOnPageChange)
        .toHaveBeenLastCalledWith('page2', expect.objectContaining({ section1: { name: 'name' } }));

      wrapper.find('#back-button').simulate('click');
      expect(mockOnPageChange)
        .toHaveBeenLastCalledWith('page1', expect.objectContaining({ section1: { name: 'name' }, section2: {} }));
    });

    test('should persist state between pages', () => {
      const wrapper = mount(
        <PagedByMachine machine={pageMachine} render={mockRender} />
      );

      wrapper.find('input#root_section1_name').props().onChange({ currentTarget: { value: 'name' } });
      wrapper.find('#next-button').simulate('click');

      expect(wrapper.find(Form).props().formData).toEqual({
        section1: {
          name: 'name'
        }
      });

      wrapper.find('#back-button').simulate('click');
      expect(wrapper.find('input#root_section1_name').props().value).toEqual('name');
    });
  });
});
