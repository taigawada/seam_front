import { Store } from 'vuex';

export const useTransitionWarning = async (
  store: Store<any>,
  callBackFn: () => void
) => {
  if (store.getters.cantTransition) {
    store.dispatch('cantTransitionModalOpen');
    const pageTransitionPromise = () =>
      new Promise((resolve) => {
        store.dispatch('pageTransitionWaiterResolveAssign', resolve);
      });
    const result = await pageTransitionPromise();
    if (result) {
      callBackFn();
      store.dispatch('toCantTransitionFalse');
    }
    store.dispatch('cantTransitionModalClose');
    store.dispatch('pageTransitionWaiterInit');
  } else {
    callBackFn();
  }
};
