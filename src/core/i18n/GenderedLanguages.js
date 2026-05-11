// @flow

const GENDERED_LANGUAGES :Object = {
  he: { male: 'he-male', female: 'he-female' },
};

const resolveLanguageCode = (baseCode :string, gender :?string) :string => {
  const genderedConfig = GENDERED_LANGUAGES[baseCode];
  if (genderedConfig) {
    if (gender && genderedConfig[gender]) {
      return genderedConfig[gender];
    }
    return genderedConfig.male;
  }
  return baseCode;
};

const getBaseLanguageCode = (effectiveCode :string) :string => {
  const entries = Object.entries(GENDERED_LANGUAGES);
  for (let i = 0; i < entries.length; i += 1) {
    const [base, variants] = entries[i];
    // $FlowFixMe
    if (Object.values(variants).includes(effectiveCode)) {
      return base;
    }
  }
  return effectiveCode;
};

const isGenderedLanguage = (baseCode :string) :boolean => baseCode in GENDERED_LANGUAGES;

export {
  GENDERED_LANGUAGES,
  getBaseLanguageCode,
  isGenderedLanguage,
  resolveLanguageCode,
};
