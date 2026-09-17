import { mount } from 'enzyme';

import StudyAccessLevelSelect from './StudyAccessLevelSelect';

import { StudyAccessLevels } from '../../../common/constants';

const render = (label) => mount(
  <StudyAccessLevelSelect
      disabled={false}
      id="access-level"
      label={label}
      onChange={() => {}}
      value={StudyAccessLevels.MANAGER} />
);

describe('StudyAccessLevelSelect', () => {

  test('renders the current level', () => {
    expect(render('Access level').text()).toContain('Manager');
  });

  test('the label sits outside the input, so it cannot overlap the control', () => {
    const wrapper = render('Access level');
    const label = wrapper.find('label').first();
    expect(label.text()).toBe('Access level');
    // MuiInputLabel-outlined is the floating in-notch label whose dense transform caused the overlap.
    expect(label.prop('className')).not.toMatch(/MuiInputLabel-outlined/);
    // MUI still renders a legend (holding a zero width space), but the label must not be inside it -- a notched
    // outline is what puts the label on top of the control.
    expect(wrapper.find('legend').text()).not.toContain('Access level');
  });

  test('the label is still announced for the select', () => {
    const wrapper = render('Access level');
    expect(wrapper.find('label').first().prop('id')).toBe('access-level-label');
    expect(wrapper.find('[role="button"]').first().prop('aria-labelledby')).toContain('access-level-label');
  });

  test('renders no label element when none is given, as in the access list rows', () => {
    expect(render(undefined).find('label')).toHaveLength(0);
  });
});
