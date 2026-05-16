import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationAR from './locales/ar.json';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  ar: { translation: translationAR }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'ar'],
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Update the document direction natively for Arabic (RTL)
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = (lng === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction
document.documentElement.dir = (i18n.language === 'ar' || i18n.language?.startsWith('ar')) ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language || 'en';

// Flutter GetX-style string extension: "nav.home".tr
Object.defineProperty(String.prototype, 'tr', {
  get: function() {
    return i18n.t(this);
  }
});

export default i18n;
