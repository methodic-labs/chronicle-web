import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';

import { formatDateTime } from '../../../common/utils';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Modal,
  Typography
} from '../../../lattice-ui-kit';
import { selectTudSubmissionDates } from '../../tud/TimeUseDiarySelectors';

const TudSubmissionHistory = ({
  handleOnClose,
  isVisible,
  candidateId,
  participantId
}) => {
  const data = useSelector(selectTudSubmissionDates(candidateId));

  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        textSecondary="Close"
        textTitle={`Participant ${participantId} TUD Submission History`}>
      <Box mb="20px" maxHeight="400px" sx={{ overflow: 'scroll' }}>
        {
          data.isEmpty()
            ? <Typography> No submission history found </Typography>
            : (
              <List aria-label="time use diary submission dates" disablePadding>
                <ListSubheader disableSticky>
                  {`${data.size} ${data.size === 1 ? 'submission' : 'submissions'}`}
                </ListSubheader>
                {
                  data.map((date) => (
                    <ListItem key={date}>
                      <ListItemText>
                        { formatDateTime(date, DateTime.DATETIME_SHORT)}
                      </ListItemText>
                    </ListItem>
                  ))
                }
              </List>
            )
        }
      </Box>
    </Modal>
  );
};

export default TudSubmissionHistory;
