import { Trash2Icon } from 'lucide-react';

import LoginTypeTag from './LoginTypeTag';
import StudyAccessLevelSelect from './StudyAccessLevelSelect';

import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '../../../lattice-ui-kit';

const StudyAccessRow = ({
  disabled,
  level,
  onChangeLevel,
  onRevoke,
  user,
}) => {

  const userId = user.principal.id;

  return (
    <Box
        alignItems="center"
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        py={1.5}>
      <Box flex="1 1 240px" minWidth={0} pr={2}>
        {/* A principal can outlive its directory entry, in which case the id is all we have to show. */}
        <Typography noWrap>{ user.email || userId }</Typography>
        {
          user.name && (
            <Typography color="textSecondary" noWrap variant="body2">
              { user.name }
            </Typography>
          )
        }
      </Box>
      <Box flex="0 0 auto" pr={2} py={0.5}>
        <LoginTypeTag user={user} />
      </Box>
      <Box alignItems="center" display="flex" flex="0 0 auto" py={0.5}>
        <StudyAccessLevelSelect
            disabled={disabled}
            id={`access-level-${userId}`}
            onChange={(nextLevel) => onChangeLevel(userId, nextLevel)}
            value={level} />
        <Box ml={1}>
          <Tooltip arrow placement="top" title="Remove access">
            {/* A disabled IconButton fires no events, so the tooltip needs an element of its own to attach to. */}
            <span>
              <IconButton
                  aria-label={`Remove access for ${user.email || userId}`}
                  disabled={disabled}
                  onClick={() => onRevoke(userId)}>
                <Trash2Icon size={16} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default StudyAccessRow;
