import { LoginTypes } from '../../../common/constants';
import { Chip, Tooltip } from '../../../lattice-ui-kit';
import { LOGIN_TYPE_LABELS } from '../constants/studyAccess';

/*
 * Shows how someone signs in, so that an admin about to grant access can tell a password account from a federated one.
 * The Auth0 connection names behind the label are in the tooltip rather than the chip, since "google-oauth2" means
 * something to us and nothing to the person reading the screen.
 */
const LoginTypeTag = ({ user }) => {

  const label = LOGIN_TYPE_LABELS[user.loginType] || LOGIN_TYPE_LABELS[LoginTypes.UNKNOWN];
  const connections = user.connections || [];
  const title = connections.length > 0
    ? `Auth0 connection: ${connections.join(', ')}`
    : 'No Auth0 connection on record for this account.';

  return (
    <Tooltip arrow placement="top" title={title}>
      <Chip
          color={user.loginType === LoginTypes.USERNAME_PASSWORD ? 'default' : 'primary'}
          label={label}
          size="small"
          variant="outlined" />
    </Tooltip>
  );
};

export default LoginTypeTag;
