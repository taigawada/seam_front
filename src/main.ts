import Vue from 'vue';
Vue.config.productionTip = false;
import App from './App.vue';
import store from './store';
import router from './router';

router.beforeEach((to, from, next) => {
  if (to.name === 'userSettings') {
    store.dispatch('teacherTabSelect', 1);
    next();
  } else {
    next();
  }
});

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);
import i18n from './components/student/i18n';
Vue.use(i18n);

import '@simple-education-dev/components/style';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import { worker } from './mock/apiMocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start({ onUnhandledRequest: 'bypass' });
}

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
