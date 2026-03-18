import { IconSplash, Spinner } from '../../lattice-ui-kit';

const NOT_AUTHORIZED = 'You are not authorized to view this content. Please contact an administrator for access.';

const Unauthorized = (props) => {
  const { isLoading } = props;
  return isLoading
    ? <IconSplash icon={() => <Spinner size="3x" />} />
    : <IconSplash caption={NOT_AUTHORIZED} />;
};

export default Unauthorized;
