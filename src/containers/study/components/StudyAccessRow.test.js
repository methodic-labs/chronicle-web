import { mount } from 'enzyme';

import StudyAccessRow from './StudyAccessRow';

import { LoginTypes, StudyAccessLevels } from '../../../common/constants';

const PASSWORD_USER = {
  connections: ['Username-Password-Authentication'],
  email: 'jane@example.com',
  emailVerified: true,
  loginType: LoginTypes.USERNAME_PASSWORD,
  name: 'Jane Doe',
  picture: null,
  principal: { id: 'auth0|1234', type: 'USER' },
};

const OAUTH_USER = {
  ...PASSWORD_USER,
  connections: ['google-oauth2'],
  email: 'john@example.com',
  loginType: LoginTypes.OAUTH,
  name: null,
  principal: { id: 'google-oauth2|5678', type: 'USER' },
};

const renderRow = (user, { disabled = false, onRevoke = () => {} } = {}) => mount(
  <StudyAccessRow
      disabled={disabled}
      level={StudyAccessLevels.MANAGER}
      onChangeLevel={() => {}}
      onRevoke={onRevoke}
      user={user} />
);

describe('StudyAccessRow', () => {

  test('shows the email address and how the person signs in', () => {
    const text = renderRow(PASSWORD_USER).text();
    expect(text).toContain('jane@example.com');
    expect(text).toContain('Jane Doe');
    expect(text).toContain('Username & password');
  });

  test('distinguishes an OAuth login from a password login', () => {
    expect(renderRow(OAUTH_USER).text()).toContain('OAuth');
  });

  test('falls back to the principal id when the directory has no email for the principal', () => {
    const orphaned = {
      connections: [],
      email: null,
      emailVerified: false,
      loginType: LoginTypes.UNKNOWN,
      name: null,
      picture: null,
      principal: { id: 'auth0|gone', type: 'USER' },
    };
    expect(renderRow(orphaned).text()).toContain('auth0|gone');
  });

  test('revoking reports the principal id of the row that was clicked', () => {
    const onRevoke = jest.fn();
    renderRow(PASSWORD_USER, { onRevoke }).find('button').first().simulate('click');
    expect(onRevoke).toHaveBeenCalledWith('auth0|1234');
  });

  test('the remove button and the level select are disabled while an update is in flight', () => {
    const wrapper = renderRow(PASSWORD_USER, { disabled: true });
    expect(wrapper.find('button').first().prop('disabled')).toBe(true);
    expect(wrapper.find('StudyAccessLevelSelect').prop('disabled')).toBe(true);
  });
});
