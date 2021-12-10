// @flow
import padStart from 'lodash/padStart';
import random from 'lodash/random';
import range from 'lodash/range';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

function generateTableData(numRows :number) :any[] {
  return range(numRows)
    .map((d, i) => {
      const activeParticipants = random(25, 250);
      const totalParticipants = random(activeParticipants, activeParticipants * 2);
      return {
        organization: `Organization ${padStart(i.toString(), 3, '0')}`,
        studyId: uuid(),
        studyName: `Study ${padStart(i.toString(), 3, '0')}`,
        dateLaunched: DateTime
          .local().minus({ days: numRows - i }).toISO(),
        activeParticipants,
        totalParticipants,
      };
    });
}

export default generateTableData;
