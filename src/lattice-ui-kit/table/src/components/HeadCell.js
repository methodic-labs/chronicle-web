import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react';

import { Cell } from './styled';

const HeadCell = (props) => {
  const {
    cellStyle,
    children,
    className,
    onClick,
    order,
    sortable,
  } = props;

  let icon = <ChevronsUpDownIcon size={16} />;
  if (order === 'asc') icon = <ChevronUpIcon size={16} />;
  if (order === 'desc') icon = <ChevronDownIcon size={16} />;

  const sortText = `Sort (${order === 'asc' ? 'Ascending' : 'Descending'})`;

  return (
    <Cell
        as="th"
        cellStyle={cellStyle}
        className={className}
        onClick={onClick}>
      {children}
      { (sortable) && <span aria-label={sortText}>{icon}</span> }
    </Cell>
  );

};

HeadCell.defaultProps = {
  cellStyle: {},
  className: undefined,
  onClick: undefined,
  order: false,
  sortable: false,
};

export default HeadCell;
