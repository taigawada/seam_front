import { Commit } from '../types';

const state: {
  cantTransition: boolean;
  cantTransitionModalOpen: boolean;
  pageTransitionWaiter: ((arg0: boolean) => void) | null;
} = {
  cantTransition: false,
  cantTransitionModalOpen: false,
  pageTransitionWaiter: null,
};

const getters = {
  cantTransition: (state: { cantTransition: boolean }) => state.cantTransition,
  cantTransitionModalOpen: (state: { cantTransitionModalOpen: boolean }) =>
    state.cantTransitionModalOpen,
  pageTransitionWaiter: (state: { pageTransitionWaiter: boolean }) =>
    state.pageTransitionWaiter,
};

const actions = {
  toCantTransitionFalse: ({ commit }: { commit: Commit }) => {
    commit('toCantTransitionFalse');
  },
  toCantTransitionTrue: ({ commit }: { commit: Commit }) => {
    commit('toCantTransitionTrue');
  },
  cantTransitionModalOpen: ({ commit }: { commit: Commit }) => {
    commit('cantTransitionModalOpen');
  },
  cantTransitionModalClose: ({ commit }: { commit: Commit }) => {
    commit('cantTransitionModalClose');
  },
  pageTransitionWaiterInit: ({ commit }: { commit: Commit }) => {
    commit('pageTransitionWaiterInit');
  },
  pageTransitionWaiterResolveAssign: (
    {
      commit,
    }: {
      commit: Commit<[() => void]>;
    },
    resolve: () => void
  ) => {
    commit('pageTransitionWaiterResolveAssign', resolve);
  },
  pageTransitionWaiterResolve: ({ commit }: { commit: Commit<[boolean]> }) => {
    commit('pageTransitionWaiterResolve', true);
  },
  pageTransitionWaiterReject: ({ commit }: { commit: Commit<[boolean]> }) => {
    commit('pageTransitionWaiterResolve', false);
  },
};

const mutations = {
  toCantTransitionFalse: (state: { cantTransition: boolean }) => {
    state.cantTransition = false;
  },
  toCantTransitionTrue: (state: { cantTransition: boolean }) => {
    state.cantTransition = true;
  },
  cantTransitionModalOpen: (state: { cantTransitionModalOpen: boolean }) => {
    state.cantTransitionModalOpen = true;
  },
  cantTransitionModalClose: (state: { cantTransitionModalOpen: boolean }) => {
    state.cantTransitionModalOpen = false;
  },
  pageTransitionWaiterInit: (state: {
    pageTransitionWaiter: ((arg0: boolean) => void) | null;
  }) => {
    state.pageTransitionWaiter = null;
  },
  pageTransitionWaiterResolveAssign: (
    state: { pageTransitionWaiter: ((arg0: boolean) => void) | null },
    resolve: () => void
  ) => {
    state.pageTransitionWaiter = resolve;
  },
  pageTransitionWaiterResolve: (
    state: {
      pageTransitionWaiter: ((arg0: boolean) => void) | null;
    },
    boolean: boolean
  ) => {
    if (state.pageTransitionWaiter) {
      state.pageTransitionWaiter(boolean);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
