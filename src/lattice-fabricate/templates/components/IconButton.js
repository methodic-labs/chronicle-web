import { Button } from '../../../lattice-ui-kit';

const IconButton = (props) => {
  const { icon, onClick, ...restProps } = props;
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Button size="small" variant="text" color="primary" onClick={onClick} {...restProps}>
      {icon}
    </Button>
  );
  /* eslint-enable */
};

export default IconButton;
