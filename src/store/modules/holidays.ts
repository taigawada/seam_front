import { Commit } from '../types';
import { useHolidays } from '@simple-education-dev/components';
import { Holidays } from '@simple-education-dev/components/types/utils/useHolidays';

const state: { holidays: Holidays[] } = {
  holidays: [],
};

const getters = {
  holidays: (state: { holidays: Holidays[] }) => state.holidays,
};

const actions = {
  getHolidays: async ({ commit }: { commit: Commit<[Holidays[]]> }) => {
    const holidays = await useHolidays();
    commit('getHolidays', holidays);
  },
};

const mutations = {
  getHolidays: (state: { holidays: Holidays[] }, holidays: Holidays[]) => {
    state.holidays = holidays;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
