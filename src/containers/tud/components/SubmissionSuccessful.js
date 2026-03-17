import {
  Box,
  Colors,
  Typography
} from 'lattice-ui-kit';
import { CircleCheckIcon } from 'lucide-react';

import TranslationKeys from '../constants/TranslationKeys';

const { GREEN } = Colors;

const SubmissionSuccessful = ({ trans }) => (
  <Box textAlign="center" mt="30px">
    <CircleCheckIcon stroke={GREEN.G300} size={32} />
    <Box mt="5px" mb="5px" fontWeight={500} fontSize="20px">
      {trans(TranslationKeys.SUBMISSION_SUCCESS_TITLE)}
    </Box>
    <Typography>
      {trans(TranslationKeys.SUBMISSION_SUCCESS)}
    </Typography>
  </Box>
);

export default SubmissionSuccessful;
