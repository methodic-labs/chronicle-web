import Backend from 'i18next-http-backend';
import Cookies from 'js-cookie';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from './translations';

import { DEFAULT_LANGUAGE, LanguageCodes } from '../../common/constants';
import { resolveLanguageCode } from './GenderedLanguages';

const SUPPORTED_BASE_CODES = new Set(
  Object.values(LanguageCodes).map((code) => code.split('-')[0])
);

const getUrlLanguageCode = () => {
  if (typeof window === 'undefined' || !window.location) return undefined;
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (!lang || !SUPPORTED_BASE_CODES.has(lang)) return undefined;
  const gender = params.get('gender') || undefined;
  return resolveLanguageCode(lang, gender);
};

let defaultLanguageCookie = Cookies.get(DEFAULT_LANGUAGE);
if (!defaultLanguageCookie || defaultLanguageCookie === 'null' || defaultLanguageCookie === 'undefined') {
  defaultLanguageCookie = undefined;
}
const defaultLanguageCode = getUrlLanguageCode() || defaultLanguageCookie || LanguageCodes.ENGLISH;

if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.dir = defaultLanguageCode.startsWith('he') ? 'rtl' : 'ltr';
}

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    lng: defaultLanguageCode,
    backend: {
      loadPath: (language) => translations[language]
    },
    fallbackLng: LanguageCodes.ENGLISH,
    debug: __ENV_DEV__, // eslint-disable-line no-undef
  })
  .then(() => i18n.loadLanguages(Object.keys(translations)));
