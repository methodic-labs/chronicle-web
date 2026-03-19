import { useTranslation } from 'react-i18next';

import { Typography } from '../../../lattice-ui-kit';
import TranslationKeys from '../constants/TranslationKeys';

const SurveyIntro = ({
  activityDay,
}) => {
  const { t } = useTranslation();

  return (
    <Typography gutterBottom variant="body2">
      {t(TranslationKeys.INTRO_TEXT, { context: activityDay, activityDay })}
    </Typography>
  );
};

export default SurveyIntro;
