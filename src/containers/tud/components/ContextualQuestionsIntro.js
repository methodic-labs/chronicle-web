import { DateTime } from 'luxon';

import { Typography } from '../../../lattice-ui-kit';
import TranslationKeys from '../constants/TranslationKeys';

// selected activity -> map to key -> get the corresponding str
const ContextualQuestionsIntro = ({
  is12hourFormat,
  selectedActivity,
  time,
  trans,
}) => {
  const activities = trans(TranslationKeys.PRIMARY_ACTIVITIES, { returnObjects: true });
  const activity = Object.values(activities).find((val) => val === selectedActivity);
  if (!activity) return null;

  // display the time in the study's clock format, not the browser locale
  const formattedTime = time.toLocaleString(is12hourFormat ? DateTime.TIME_SIMPLE : DateTime.TIME_24_SIMPLE);

  return (
    <Typography gutterBottom variant="body2">
      {
        trans(
          TranslationKeys.CONTEXTUAL_TEXT,
          { time: formattedTime, activity, interpolation: { escapeValue: false } }
        )
      }
    </Typography>
  );
};

export default ContextualQuestionsIntro;
