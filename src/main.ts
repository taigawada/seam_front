import Vue from 'vue';
Vue.config.productionTip = false;
import App from './App.vue';
import store from './store';
import router from './router';

// routerとタブを同期
router.afterEach((to) => {
  if (to.name === 'userSettings') {
    store.dispatch('teacherTabSelect', 1);
  } else {
    store.dispatch('teacherTabSelect', 0);
  }
});

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);
import i18n from './components/student/i18n';
Vue.use(i18n);
import '@simple-education-dev/components/style';
import { SimpleComponents } from '@simple-education-dev/components';
Vue.use(SimpleComponents);

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
