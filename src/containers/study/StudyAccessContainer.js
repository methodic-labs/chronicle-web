import { useEffect, useMemo } from 'react';

import { List, getIn } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';

import StudyAccessRow from './components/StudyAccessRow';
import GrantStudyAccessPanel from './components/GrantStudyAccessPanel';
import {
  GET_STUDY_PERMISSIONS,
  UPDATE_STUDY_PERMISSIONS,
  getStudyPermissions,
  updateStudyPermissions,
} from './actions';
import {
  ACCESS_LEVEL_LABELS,
  grantAccessUpdate,
  revokeAccessUpdate,
  setAccessLevelUpdate,
} from './constants/studyAccess';
import { withoutInternalAccounts } from './utils';

import { BasicErrorComponent, Spinner } from '../../common/components';
import {
  ERROR,
  MANAGERS,
  OWNERS,
  STUDIES,
  STUDY_ID,
  StudyAccessLevels,
  UPDATE,
  VIEWERS,
} from '../../common/constants';
import {
  isFailure,
  isPending,
  isStandby,
  useRequestState,
} from '../../common/utils';
import { getUserInfo } from '../../core/auth/utils';
import { selectMyKeys, selectStudyPermissions } from '../../core/redux/selectors';
import {
  Box,
  Card,
  CardSegment,
  Typography,
} from '../../lattice-ui-kit';

/* Strongest access first, so the list reads top down from "can do anything" to "can only look". */
const LEVELS_IN_ORDER = [
  { key: OWNERS, level: StudyAccessLevels.OWNER },
  { key: MANAGERS, level: StudyAccessLevels.MANAGER },
  { key: VIEWERS, level: StudyAccessLevels.VIEWER },
];

const StudyAccessContainer = ({ study }) => {

  const dispatch = useDispatch();
  const studyId = study.id;

  const myKeys = useSelector(selectMyKeys());
  const isOwner = myKeys.has(List([studyId]));

  const permissions = useSelector(selectStudyPermissions(studyId));
  const getRS = useRequestState([STUDIES, GET_STUDY_PERMISSIONS]);
  const updateRS = useRequestState([STUDIES, UPDATE_STUDY_PERMISSIONS]);
  const updateError = useSelector((state) => getIn(state, [STUDIES, UPDATE_STUDY_PERMISSIONS, ERROR]));

  useEffect(() => {
    if (isOwner) {
      dispatch(getStudyPermissions(studyId));
    }
  }, [dispatch, isOwner, studyId]);

  // Our own staff accounts are hidden from customer admins -- see withoutInternalAccounts. This is display only:
  // a hidden account keeps whatever access it holds, and the server still counts it.
  const viewerEmail = (getUserInfo() || {}).email;

  const people = useMemo(() => LEVELS_IN_ORDER.flatMap(({ key, level }) => (
    withoutInternalAccounts((permissions.get(key) || List()).toJS(), viewerEmail)
      .map((user) => ({ level, user }))
  )), [permissions, viewerEmail]);

  const existingUserIds = useMemo(
    () => new Set(people.map(({ user }) => user.principal.id)),
    [people]
  );

  const applyUpdate = (update) => {
    dispatch(updateStudyPermissions({ [STUDY_ID]: studyId, [UPDATE]: update }));
  };

  const handleGrant = (userId, level) => applyUpdate(grantAccessUpdate(userId, level));
  const handleChangeLevel = (userId, level) => applyUpdate(setAccessLevelUpdate(userId, level));
  const handleRevoke = (userId) => applyUpdate(revokeAccessUpdate(userId));

  if (!isOwner) {
    return (
      <Card>
        <CardSegment>
          <Typography>
            You need owner access to this study to see or change who else can access it.
          </Typography>
        </CardSegment>
      </Card>
    );
  }

  if (isStandby(getRS) || isPending(getRS)) {
    return <Spinner />;
  }

  if (isFailure(getRS)) {
    return <BasicErrorComponent />;
  }

  // Updates are rejected rather than applied partially, so the list on screen is still accurate when one fails.
  const isUpdating = isPending(updateRS);

  return (
    <Card>
      <CardSegment>
        <GrantStudyAccessPanel
            disabled={isUpdating}
            existingUserIds={existingUserIds}
            onGrant={handleGrant}
            studyId={studyId} />
      </CardSegment>
      <CardSegment>
        <Typography gutterBottom variant="h5">People with access</Typography>
        {
          isFailure(updateRS) && (
            <Box mb={2}>
              <Typography color="error" variant="body2">
                {
                  updateError?.message
                  || 'Sorry, that change could not be saved. Please try again or contact support@getmethodic.com.'
                }
              </Typography>
            </Box>
          )
        }
        {
          people.length === 0
            ? (
              <Typography color="textSecondary" variant="body2">
                Nobody has access to this study yet.
              </Typography>
            )
            : people.map(({ level, user }) => (
              <StudyAccessRow
                  disabled={isUpdating}
                  key={`${level}-${user.principal.id}`}
                  level={level}
                  onChangeLevel={handleChangeLevel}
                  onRevoke={handleRevoke}
                  user={user} />
            ))
        }
        <Box mt={2}>
          <Typography color="textSecondary" variant="body2">
            { ACCESS_LEVEL_LABELS[StudyAccessLevels.OWNER] }
            s can manage the study and change who has access.
            { ' ' }
            { ACCESS_LEVEL_LABELS[StudyAccessLevels.MANAGER] }
            s can manage the study but not its access.
            { ' ' }
            A study must always keep at least one
            {' '}
            { ACCESS_LEVEL_LABELS[StudyAccessLevels.OWNER].toLowerCase() }
            .
          </Typography>
        </Box>
      </CardSegment>
    </Card>
  );
};

export default StudyAccessContainer;
