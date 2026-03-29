# CLAUDE.md — chronicle-web

## Internationalization (i18n)

### Stack

- **i18next** — core translation library
- **react-i18next** — React bindings (`useTranslation` hook)
- **i18next-browser-languagedetector** — browser language detection
- **i18next-http-backend** — translation loading backend
- **js-cookie** — persists language preference in a `defaultLanguage` cookie

### Configuration

Initialized in `src/core/i18n/index.js`, imported first in `src/index.js`. On startup:
1. Reads language from the `defaultLanguage` cookie (falls back to `en`)
2. Initializes i18next with that language and English as fallback
3. Eagerly loads all supported languages via `i18n.loadLanguages()`

### Supported Languages

Defined in `src/common/constants/objects.js` (`LanguageCodes`) and aggregated in `src/core/i18n/translations.js`:

| Code | Language |
|------|----------|
| `en` | English (default/fallback) |
| `de` | German |
| `es` | Spanish |
| `he-male` | Hebrew (male) |
| `he-female` | Hebrew (female) |
| `sv` | Swedish |

### Gendered Languages

Some languages (currently Hebrew) require gender-specific translations. This is handled via `src/core/i18n/GenderedLanguages.js`:
- Each gendered language has separate translation files (e.g., `he-male/`, `he-female/`) and distinct i18next language codes
- The UI dropdown shows a single entry (e.g., "עברית"); the `?gender=male|female` URL parameter selects the variant
- `resolveLanguageCode(baseCode, gender)` maps a base code + gender to the effective i18next code
- `getBaseLanguageCode(effectiveCode)` reverses the mapping (e.g., `'he-male'` → `'he'`)
- If no gender param is provided for a gendered language, defaults to male
- Hebrew activates RTL (`document.documentElement.dir = 'rtl'`)

To add another gendered language, add its variants to the `GENDERED_LANGUAGES` map in `GenderedLanguages.js`, create translation directories, and add a `SupportedLanguages` entry with the base code.

### Translation Files

Flat JSON files at `src/core/i18n/<code>/translation.json`. Features:
- `{{variable}}` interpolation (e.g., `{{activityDay}}`, `{{time}}`)
- `$t(key.path)` nested translation references for conditional text
- `returnObjects: true` option to retrieve arrays/objects (e.g., activity lists, enum labels)

### How Components Consume Translations

**Direct hook usage** (top-level containers):
```js
const { i18n, t } = useTranslation();
```

**Prop drilling** (child components receive from parent):
- `trans` — the `t` translation function
- `translationData` — raw `i18n.store.data` for building reverse lookups
- `language` — current language code (`i18n.language`)

### Translation Key Constants

Each feature area centralizes its translation keys in a constants file that maps descriptive names to JSON key paths:
- `src/containers/tud/constants/TranslationKeys.js` — time-use diary keys
- `src/containers/survey/constants/TranslationKeys.js` — survey keys

Components reference keys via these constants rather than raw strings.

### Language Selection Flow (Time-Use Diary)

1. `TimeUseDiaryContainer` reads language from cookie, then falls back to per-study setting (`StudySettingTypes.TIME_USE_DIARY.LANGUAGE`), then to English
2. User can change language via a dropdown in `HeaderComponent`
3. On intro page: language changes immediately
4. On other pages: `ConfirmChangeLanguage` modal warns that progress will be lost, then resets the form
5. Selected language is persisted back to the `defaultLanguage` cookie

**Known limitation:** Today/yesterday day selection is only available for English and German. Spanish, Swedish, and Hebrew surveys always use "yesterday".

### Submission Data Normalization

All survey responses are normalized to English before API submission, regardless of display language:
- `src/containers/tud/utils/createEnglishTranslationLookup.js` — builds a reverse map from localized values to English keys
- `src/containers/tud/utils/translateToEnglish.js` — applies the reverse map to form data at submission time

This ensures backend data consistency across languages.

## Backend Selection

### Hostname-Based Auto-Detection

The backend URL is determined automatically by the frontend hostname in `src/core/config/Configuration.js`. There is no webpack dev server proxy — the frontend makes direct HTTP requests to the backend.

| Frontend hostname | Backend URL |
|---|---|
| `localhost` | `http://localhost:8080` |
| `staging.getmethodic.com` | `https://api.staging.getmethodic.com` |
| `*.getmethodic.com` (non-staging) | `https://api.getmethodic.com` |

The `getDefaultBaseUrl()` function inspects `window.location.hostname`:
- `localhost` → LOCAL
- Ends with `getmethodic.com` and starts with `staging` → STAGING
- Ends with `getmethodic.com` otherwise → PRODUCTION

`setBaseUrl()` also accepts shorthand strings (`'localhost'`, `'staging'`, `'production'`) or full URLs, and allows any custom `https://` URL that passes validation.

### Running Locally

`npm run app` starts the webpack dev server on port 9000. With the default hostname-based detection, API requests go to `http://localhost:8080`, so a local chronicle-server must be running.

### API Request Plumbing

`src/core/api/axios/getApiBaseUrl.js` maps API names to path prefixes (e.g., `STUDY_API` → `chronicle/v3/study`) and prepends the configured `baseUrl`. Axios instances are created per API via `getApiAxiosInstance()`.

### Jest Tests

Jest tests mock `Configuration.getConfig()` to return a fixed base URL (typically `https://test.getmethodic.com`), so no real backend is needed. The test URL is set to `http://localhost` in `config/jest/jest.config.js`.

### Translation Tests

`src/core/i18n/translations.test.js` validates:
- All supported languages have translation files
- Array translations have matching lengths across languages
- All languages have identical key structures
- All JSON keys are accounted for in `TranslationKeys` constants
- `{{interpolation}}` variables are preserved across all language files
