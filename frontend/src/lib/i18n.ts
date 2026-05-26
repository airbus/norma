import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/locales/en/common.json';
import enPages from '@/locales/en/pages.json';
import enComponents from '@/locales/en/components.json';
import enData from '@/locales/en/data.json';

import frCommon from '@/locales/fr/common.json';
import frPages from '@/locales/fr/pages.json';
import frComponents from '@/locales/fr/components.json';
import frData from '@/locales/fr/data.json';

import deCommon from '@/locales/de/common.json';
import dePages from '@/locales/de/pages.json';
import deComponents from '@/locales/de/components.json';
import deData from '@/locales/de/data.json';

import esCommon from '@/locales/es/common.json';
import esPages from '@/locales/es/pages.json';
import esComponents from '@/locales/es/components.json';
import esData from '@/locales/es/data.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, pages: enPages, components: enComponents, data: enData },
      fr: { common: frCommon, pages: frPages, components: frComponents, data: frData },
      de: { common: deCommon, pages: dePages, components: deComponents, data: deData },
      es: { common: esCommon, pages: esPages, components: esComponents, data: esData },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'pages', 'components', 'data'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'norma-language',
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export function changeLanguage(lang: string) {
  return i18n.changeLanguage(lang);
}

export default i18n;
