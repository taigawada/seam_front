import Vue from 'vue';
import Vuex from 'vuex';

import currentTeacher from './modules/currentTeacher';
import teacherTabs from './modules/teacherTabs';
import holidays from './modules/holidays';
import cantTransition from './modules/cantTransition';
import toast from './modules/toast';

import VuexPersistence from 'vuex-persist';
import { Holidays } from './modules/getHolidays';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: { holidays: Holidays[] }) => ({ holidays: state.holidays }),
  filter: (mutation) => mutation.type == 'getHolidays',
});

Vue.use(Vuex);
export default new Vuex.Store({
  strict: true,
  modules: {
    currentTeacher,
    teacherTabs,
    holidays,
    cantTransition,
    toast,
  },
  plugins: [vuexLocal.plugin],
});
