// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DOWNLOAD_DAILY_TUD_DATA :'DOWNLOAD_DAILY_TUD_DATA' = 'DOWNLOAD_DAILY_TUD_DATA';
const downloadDailyTudData :RequestSequence = newRequestSequence(DOWNLOAD_DAILY_TUD_DATA);

const DOWNLOAD_ALL_TUD_DATA :'DOWNLOAD_ALL_TUD_DATA' = 'DOWNLOAD_ALL_TUD_DATA';
const downloadAllTudData :RequestSequence = newRequestSequence(DOWNLOAD_ALL_TUD_DATA);

export {
  DOWNLOAD_ALL_TUD_DATA,
  DOWNLOAD_DAILY_TUD_DATA,
  downloadAllTudData,
  downloadDailyTudData,
};
