import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { createI18n, castToVueI18n } from 'vue-i18n-bridge';
import messages from './messages';

Vue.use(VueI18n, { bridge: true });
const i18n = castToVueI18n(
  createI18n(
    {
      legacy: false,
      locale: 'all',
      fallbackLocale: 'all',
      messages,
    },
    VueI18n
  )
);

export default i18n;
