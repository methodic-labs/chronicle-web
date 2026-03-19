import { DateTime } from 'luxon';

import { Typography } from '../../../lattice-ui-kit';
import TranslationKeys from '../constants/TranslationKeys';

// selected activity -> map to key -> get the corresponding str
const ContextualQuestionsIntro = ({ selectedActivity, time, trans }) => {
  const activities = trans(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });
  const activity = Object.values(activities).find((val) => val === selectedActivity);
  if (!activity) return null;

  return (
    <Typography gutterBottom variant="body2">
      {
        trans(
          TranslationKeys.CONTEXTUAL_TEXT,
          { time: time.toLocaleString(DateTime.TIME_SIMPLE), activity, interpolation: { escapeValue: false } }
        )
      }
    </Typography>
  );
};

export default ContextualQuestionsIntro;
