import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import VueCompositionApi from '@vue/composition-api';

import '@simple-education-dev/components/style';

import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
Vue.use(VueQuillEditor);

Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
