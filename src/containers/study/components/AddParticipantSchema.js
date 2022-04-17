// @flow

import { PAGE_1_SECTION_1, PARTICIPANT_ID } from '../../../common/constants';

const dataSchema = {
  properties: {
    [PAGE_1_SECTION_1]: {
      properties: {
        [PARTICIPANT_ID]: {
          title: 'Participant ID',
          type: 'string'
        }
      },
      required: [
        PARTICIPANT_ID
      ],
      title: '',
      type: 'object'
    }
  },
  title: '',
  type: 'object'
};

const uiSchema = {
  [PAGE_1_SECTION_1]: {
    classNames: 'column-span-12 grid-container',
    [PARTICIPANT_ID]: {
      classNames: 'column-span-12'
    }
  }
};

export {
  dataSchema,
  uiSchema
};
