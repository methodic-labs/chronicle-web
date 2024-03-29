// @flow

import { faLockAlt } from '@fortawesome/pro-duotone-svg-icons';
import { IconSplash, Spinner } from 'lattice-ui-kit';

const NOT_AUTHORIZED = 'You are not authorized to view this content. Please contact an administrator for access.';

type Props = {
  isLoading :boolean;
};

const Unauthorized = (props :Props) => {
  const { isLoading } = props;
  return isLoading
    ? <IconSplash icon={() => <Spinner size="3x" />} />
    : <IconSplash caption={NOT_AUTHORIZED} icon={faLockAlt} />;
};

export default Unauthorized;
