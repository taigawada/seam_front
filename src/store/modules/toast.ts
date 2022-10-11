import { nextTick } from 'vue-demi';
import { Commit } from '../types';

interface ToastContent {
  content: string;
  action?: {
    label: string;
    onAction: () => void;
  };
  isError?: boolean;
}
interface Toast extends ToastContent {
  active: boolean;
  key: number;
  duration: number;
}

const state: { toasts: Toast[] } = {
  toasts: [],
};

const getters = {
  toasts: (state: { toasts: Toast[] }) => state.toasts,
};

const actions = {
  setToast: (
    { commit }: { commit: Commit<[Toast | number]> },
    toastContent: ToastContent
  ) => {
    const key = window.crypto.getRandomValues(new Uint32Array(1))[0];
    let duration = 3000;
    if (toastContent.isError) {
      duration = 5500;
    }
    commit('setToast', {
      key: key,
      active: false,
      duration: duration,
      ...toastContent,
    });
    nextTick(() => {
      commit('activeToast', key);
    });
  },
  dismissToast: async (
    { commit }: { commit: Commit<[Toast | undefined]> },
    toastContent: Toast
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    commit('dismissToast', toastContent);
  },
};

const mutations = {
  setToast: (state: { toasts: Toast[] }, toast: Toast) => {
    state.toasts.push(toast);
  },
  activeToast: (state: { toasts: Toast[] }, key: number) => {
    state.toasts[state.toasts.findIndex((toast) => toast.key === key)].active =
      true;
  },
  dismissToast: (state: { toasts: Toast[] }, toast: Toast) => {
    const index = state.toasts.findIndex((target) => target.key === toast.key);
    if (index !== -1) {
      state.toasts.splice(index, 1);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
