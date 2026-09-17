import { useEffect, useState } from 'react';

import { UserPlusIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import LoginTypeTag from './LoginTypeTag';
import StudyAccessLevelSelect from './StudyAccessLevelSelect';

import {
  EMAIL,
  STUDIES,
  STUDY_ID,
  StudyAccessLevels,
} from '../../../common/constants';
import { isFailure, isPending, useRequestState } from '../../../common/utils';
import { getUserInfo } from '../../../core/auth/utils';
import { selectUserSearchResults } from '../../../core/redux/selectors';
import {
  Box,
  Button,
  SearchInput,
  Spinner,
  Typography,
} from '../../../lattice-ui-kit';
import { SEARCH_STUDY_USERS, clearUserSearchResults, searchStudyUsers } from '../actions';
import { withoutInternalAccounts } from '../utils';

/*
 * The server refuses a search shorter than this, so there is no point issuing one -- and a one character prefix would
 * match most of the directory anyway.
 */
const MIN_SEARCH_LENGTH = 2;

const GrantStudyAccessPanel = ({
  disabled,
  existingUserIds,
  onGrant,
  studyId,
}) => {

  const dispatch = useDispatch();

  const [query, setQuery] = useState('');
  const [level, setLevel] = useState(StudyAccessLevels.MANAGER);

  const results = useSelector(selectUserSearchResults());
  const searchRS = useRequestState([STUDIES, SEARCH_STUDY_USERS]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length >= MIN_SEARCH_LENGTH) {
      dispatch(searchStudyUsers({ [EMAIL]: trimmed, [STUDY_ID]: studyId }));
    }
    else {
      dispatch(clearUserSearchResults());
    }
  }, [dispatch, query, studyId]);

  // Leaving stale results in the store would show them again the next time the tab is opened.
  useEffect(() => () => {
    dispatch(clearUserSearchResults());
  }, [dispatch]);

  // Our own staff accounts are hidden from customer admins -- see withoutInternalAccounts.
  const viewerEmail = (getUserInfo() || {}).email;
  const users = withoutInternalAccounts(results.toJS(), viewerEmail);
  const hasQuery = query.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <Box>
      <Typography gutterBottom variant="h5">Grant access</Typography>
      <Typography color="textSecondary" gutterBottom variant="body2">
        Search for someone by email address. Matching is on the start of the address, so &quot;jane&quot; finds
        jane@example.com.
      </Typography>
      {/* flex-end so the search box and the level select line up along their bottom edge, since only the select
          carries a label above it. */}
      <Box alignItems="flex-end" display="flex" flexWrap="wrap" mt={2}>
        <Box flex="1 1 320px" pb={0.5} pr={2}>
          <SearchInput
              disabled={disabled}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users by email"
              value={query} />
        </Box>
        <Box flex="0 0 auto" pb={0.5}>
          <StudyAccessLevelSelect
              disabled={disabled}
              id="grant-access-level"
              label="Access level"
              onChange={setLevel}
              value={level} />
        </Box>
      </Box>
      <Box mt={2}>
        {
          isPending(searchRS) && (
            <Box py={2} textAlign="center">
              <Spinner />
            </Box>
          )
        }
        {
          isFailure(searchRS) && (
            <Typography color="error" variant="body2">
              Sorry, the user search failed. Please try again.
            </Typography>
          )
        }
        {
          hasQuery && !isPending(searchRS) && !isFailure(searchRS) && users.length === 0 && (
            <Typography color="textSecondary" variant="body2">
              No users found for &quot;
              { query.trim() }
              &quot;.
            </Typography>
          )
        }
        {
          users.map((user) => {
            const userId = user.principal.id;
            const alreadyHasAccess = existingUserIds.has(userId);
            return (
              <Box
                  alignItems="center"
                  borderBottom="1px solid rgba(0, 0, 0, 0.08)"
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="space-between"
                  key={userId}
                  py={1.5}>
                <Box flex="1 1 240px" minWidth={0} pr={2}>
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
                <Box flex="0 0 auto" py={0.5}>
                  <Button
                      color="primary"
                      disabled={disabled || alreadyHasAccess}
                      onClick={() => onGrant(userId, level)}
                      startIcon={<UserPlusIcon size={16} />}
                      variant="outlined">
                    { alreadyHasAccess ? 'Already has access' : 'Grant access' }
                  </Button>
                </Box>
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
};

export default GrantStudyAccessPanel;
