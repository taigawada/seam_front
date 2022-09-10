import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import i18n from './components/student/i18n';

import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
Vue.use(i18n);
Vue.config.productionTip = false;

import '@simple-education-dev/components/style';

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
