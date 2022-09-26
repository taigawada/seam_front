import { Commit } from '../types';

const state: { currentTeacherTabIndex: number } = {
  currentTeacherTabIndex: 0,
};

const getters = {
  currentTeacherTabIndex: (state: { currentTeacherTabIndex: number }) =>
    state.currentTeacherTabIndex,
};

const actions = {
  teacherTabSelect: async (
    { commit }: { commit: Commit<[number]> },
    selectedTab: number
  ) => {
    commit('teacherTabSelect', selectedTab);
  },
};

const mutations = {
  teacherTabSelect: (
    state: { currentTeacherTabIndex: number },
    selectedTab: number
  ) => {
    state.currentTeacherTabIndex = selectedTab;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
