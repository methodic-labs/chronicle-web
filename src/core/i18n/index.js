// @flow

import Backend from 'i18next-http-backend';
import Cookies from 'js-cookie';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from './translations';

import { DEFAULT_LANGUAGE, LanguageCodes } from '../../common/constants';

declare var __ENV_DEV__ :boolean;

const defaultLng = Cookies.get(DEFAULT_LANGUAGE) || LanguageCodes.ENGLISH;

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    lng: defaultLng,
    backend: {
      loadPath: (language) => translations[language]
    },
    fallbackLng: LanguageCodes.ENGLISH,
    debug: __ENV_DEV__
  });
