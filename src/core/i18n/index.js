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

const PARTICIPANT_HASH_PREFIXES = ['#/time-use-diary', '#/survey'];

// The app uses HashRouter, so query params live after the '#'.
const getHashQueryParams = () => {
  if (typeof window === 'undefined' || !window.location) return new URLSearchParams();
  const hash = window.location.hash || '';
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return new URLSearchParams();
  return new URLSearchParams(hash.substring(qIndex + 1));
};

const isParticipantRoute = () => {
  if (typeof window === 'undefined' || !window.location) return false;
  const hash = window.location.hash || '';
  return PARTICIPANT_HASH_PREFIXES.some((prefix) => hash.startsWith(prefix));
};

const getUrlLanguageCode = () => {
  const params = getHashQueryParams();
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
  const shouldRtl = defaultLanguageCode.startsWith('he') && isParticipantRoute();
  document.documentElement.dir = shouldRtl ? 'rtl' : 'ltr';
}

const resources = Object.fromEntries(
  Object.entries(translations).map(([code, t]) => [code, { translation: t }])
);

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    lng: defaultLanguageCode,
    resources,
    fallbackLng: LanguageCodes.ENGLISH,
    debug: __ENV_DEV__, // eslint-disable-line no-undef
  });
