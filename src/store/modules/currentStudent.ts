import { SeamApiStudent } from '@/api/endpoints';
import { Commit } from '../types';

const state: { studentId: number | null } = {
  studentId: null,
};

const getters = {
  teacherId: (state: { studentId: number | null }) => state.studentId,
};

const actions = {
  setTeacherId: async ({ commit }: { commit: Commit<[number]> }) => {
    const studentId = await SeamApiStudent.getStudentId();
    commit('setStudentId', parseInt(studentId.data));
  },
};

const mutations = {
  setTeacherId: (state: { studentId: number }, studentId: number) => {
    state.studentId = studentId;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
