import { SeamApiTeacher } from '@/api/endpoints';
import { Commit } from '../types';

const state: { teacherId: number | null } = {
  teacherId: null,
};

const getters = {
  teacherId: (state: { teacherId: number | null }) => state.teacherId,
};

const actions = {
  setTeacherId: async ({ commit }: { commit: Commit<[number]> }) => {
    const teacherId = await SeamApiTeacher.getTeacherId();
    commit('setTeacherId', parseInt(teacherId.data));
  },
};

const mutations = {
  setTeacherId: (state: { teacherId: number }, teacherId: number) => {
    state.teacherId = teacherId;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
