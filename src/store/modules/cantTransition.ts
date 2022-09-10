import { Commit } from '../types';

const state: { cantTransition: boolean } = {
  cantTransition: false,
};

const getters = {
  cantTransition: (state: { cantTransition: boolean }) => state.cantTransition,
};

const actions = {
  toCantTransitionFalse: ({ commit }: { commit: Commit<[boolean]> }) => {
    commit('toCantTransitionFalse', false);
  },
  toCantTransitionTrue: ({ commit }: { commit: Commit<[boolean]> }) => {
    commit('toCantTransitionTrue', true);
  },
};

const mutations = {
  toCantTransitionFalse: (
    state: { cantTransition: boolean },
    Boolean: boolean
  ) => {
    state.cantTransition = Boolean;
  },
  toCantTransitionTrue: (
    state: { cantTransition: boolean },
    Boolean: boolean
  ) => {
    state.cantTransition = Boolean;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
