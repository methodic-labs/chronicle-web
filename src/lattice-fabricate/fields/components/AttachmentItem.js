// @flow

import { Trash2Icon } from 'lucide-react';
import styled from 'styled-components';

import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '../../../lattice-ui-kit';
import type { UUID } from '../../types';

const ItemTextWrapper = styled.div`
  padding-right: ${(props) => (props.paddingRight ? props.paddingRight : '16px')};
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 140px;
`;

type Props = {
  divider :boolean;
  file :{
    date :string;
    fieldId :string;
    href :string;
    id :UUID;
    name :string;
    type :string;
  };
  onDelete :Function;
}

const AttachmentItem = ({
  divider,
  file,
  onDelete,
} :Props) => {

  const handleDelete = () => {
    onDelete(file);
  };

  const {
    date,
    href,
    name,
  } = file;

  return (
    <ListItem divider={divider}>
      <ItemTextWrapper>
        <Typography
            component="a"
            download
            href={href}
            noWrap
            rel="noreferrer"
            target="_blank">
          {name}
        </Typography>
        <ListItemText secondary={date} />
      </ItemTextWrapper>
      <ListItemSecondaryAction>
        <IconButton aria-label="Remove" onClick={handleDelete} title="Remove">
          <Trash2Icon size={16} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default AttachmentItem;
